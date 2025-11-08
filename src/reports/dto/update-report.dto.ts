import { PartialType } from '@nestjs/swagger';
import { CreateReportDto } from './create-report.dto';
import { ReportStatus } from '@prisma/client';

export class UpdateReportDto extends PartialType(CreateReportDto) {
    status: ReportStatus
}
