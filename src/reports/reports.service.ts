import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ReportStatus, UsersRole } from '../common/enums';
import { report } from 'process';

@Injectable()
export class ReportsService {

  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async create(userId: number, createReportDto: CreateReportDto) {
    const existUser = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!existUser) throw new NotFoundException("Bunday user topilmadi ❌");

    const existHouse = await this.prismaService.house.findUnique({ where: { id: createReportDto.house_id } });
    if (!existHouse) throw new NotFoundException("Bunday uy topilmadi ❌");

    const newReport = await this.prismaService.report.create({
      data: {
        ...createReportDto,
        reporter_id: userId,
        status: ReportStatus.pending
      },
      include: {
        house: true,
        reporter: {
          select: {
            id: true,
            full_name: true,
            phone: true
          }
        }
      }
    });

    return newReport;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const reports = await this.prismaService.report.findMany({
      skip,
      take: limit,
      include: {
        house: true,
        reporter: {
          select: {
            id: true,
            full_name: true,
            phone: true
          }
        }
      }
    });
    if (reports.length === 0) return { message: "Hali hech qanday shikoyatlar yoq ✅" };
    const total = await this.prismaService.report.count();

    return {
      data: reports,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(userId: number, id: number) {
    const existUser = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!existUser) throw new NotFoundException("Bunday user topilmadi ❌");

    const existReport = await this.prismaService.report.findUnique({ where: { id } });
    if (!existReport) throw new NotFoundException("Bunday shikoyat topilmadi ❌");

    const existHouse = await this.prismaService.house.findUnique({ where: { id: existReport.house_id } });
    if (
      existUser.role == UsersRole.superadmin ||
      existUser.role == UsersRole.admin ||
      userId == existReport.reporter_id ||
      userId == existHouse.owner_id
    ) {
      return existReport;
    } else {
      return { message: "Bu shikoyatni faqat adminlar yoki shikoyat qilgan userning ozi kora oladi faqat ❗️" }
    }
  }

  async update(userId: number, id: number, updateReportDto: UpdateReportDto) {
    const existUser = await this.prismaService.user.findUnique({ where: { id: userId } });
    const existReport = await this.prismaService.report.findUnique({ where: { id } });
    if (existUser.role == UsersRole.superadmin || existUser.role == UsersRole.admin || existReport.reporter_id == userId) {
      if (existUser.role == UsersRole.superadmin || existUser.role == UsersRole.admin) {
        const updatedReport = await this.prismaService.report.update({
          where: { id },
          data: { status: updateReportDto.status },
          include: {
            house: true,
            reporter: {
              select: {
                id: true,
                full_name: true,
                phone: true
              }
            }
          }
        });
        return {
          message: "Report updated successfully 🔄✅",
          data: updatedReport
        };
      }
      if (updateReportDto.status) throw new BadRequestException("Statusni faqat adminlar ozgartirishi mumkin ❗️");

      if (updateReportDto.house_id) {
        const existHouse = await this.prismaService.house.findUnique({ where: { id: updateReportDto.house_id } });
        if (!existHouse) throw new NotFoundException("Bunday uy topilmadi ❌");
      }
      const updatedReport = await this.prismaService.report.update({
        where: { id },
        data: { ...updateReportDto },
        include: {
          house: true,
          reporter: {
            select: {
              id: true,
              full_name: true,
              phone: true
            }
          }
        }
      });
      return {
        message: "Report updated successfully 🔄✅",
        data: updatedReport
      };
    } else {
      throw new ForbiddenException("Shikoyatni faqat adminlar va shikoyat qilgan user ozgartirishi mumkin ❗️");
    }

  }

  async remove(userId: number, id: number) {
    const existUser = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!existUser) throw new NotFoundException("Bunday user topilmadi ❗️");

    const existReport = await this.prismaService.report.findUnique({ where: { id } });
    if (!existReport) throw new NotFoundException("Bunday shikoyat topilmadi ❌");

    if (existUser.role == UsersRole.superadmin || existReport.reporter_id == userId) {
      const deletedReport = await this.prismaService.report.delete({
        where: { id },
        include: {
          house: true,
          reporter: {
            select: {
              id: true,
              full_name: true,
              phone: true
            }
          }
        }
      });
      return {
        message: "Report deleted successfully 🗑️✅",
        data: deletedReport
      };
    } else {
      throw new ForbiddenException("Shikoyatni faqat adminlar yoki shikoyat qilgan user o'chira oladi ❗️");
    };
  }
}
