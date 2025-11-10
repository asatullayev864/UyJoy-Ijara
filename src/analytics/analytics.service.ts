import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) { }

  // 1. Eng mashhur uylar (bronlar soniga ko‘ra)
  async getTopHouses() {
    const result: any[] = await this.prisma.$queryRaw`
    SELECT h.id, h.title, COUNT(b.id) AS booking_count
    FROM houses h
    JOIN bookings b ON h.id = b.house_id
    GROUP BY h.id, h.title
    ORDER BY booking_count DESC
    LIMIT 5;
  `;

    return result.map(r => ({
      ...r,
      booking_count: Number(r.booking_count), // bigint -> number
    }));
  }

  // 2. Har bir uyning umumiy daromadi
  async getHouseIncomes() {
    const result: any[] = await this.prisma.$queryRaw`
    SELECT 
      h.id,
      h.title, 
      SUM(p.total_amount) AS total_income
    FROM houses h
    JOIN bookings b ON h.id = b.house_id
    JOIN payment p ON b.id = p.booking_id
    GROUP BY h.id, h.title
    ORDER BY total_income DESC;
  `;

    // Agar SUM puli bigint bo‘lsa, Number’ga o‘tkazish
    return result.map(r => ({
      ...r,
      total_income: Number(r.total_income),
      id: Number(r.id),
    }));
  }

  // 3. Foydalanuvchi statistikasi (bron va to‘lov)
  async getUserStats() {
    function toJSONFriendly(obj: any) {
      return JSON.parse(
        JSON.stringify(obj, (_, value) =>
          typeof value === 'bigint' ? Number(value) : value
        ),
      );
    }

    const result = await this.prisma.$queryRaw`
    SELECT 
      u.full_name,
      COUNT(b.id) AS total_bookings,
      COALESCE(SUM(p.paid_amount), 0) AS total_paid
    FROM users u
    LEFT JOIN bookings b ON u.id = b.client_id
    LEFT JOIN payment p ON b.id = p.booking_id
    GROUP BY u.full_name
    ORDER BY total_paid DESC;
  `;
    return toJSONFriendly(result);
  }

  // 4. Uylarning o‘rtacha reytingi
  async getHouseRatings() {
    const result: any[] = await this.prisma.$queryRaw`
    SELECT 
      h.id,
      h.title,
      ROUND(AVG(CASE WHEN r.rating IS NOT NULL THEN r.rating ELSE 0 END), 2) AS average_rating
    FROM houses h
    LEFT JOIN reviews r ON h.id = r.house_id
    GROUP BY h.id, h.title
    ORDER BY average_rating DESC;
  `;

    // Agar kerak bo‘lsa bigint’larni Number’ga aylantirish
    return result.map(r => ({
      ...r,
      id: Number(r.id)
    }));
  }
}