export class CreateBookingDto {
    house_id: number;
    client_id: number;
    rental_time_id: number;
    start_date: Date;
    how_many: number;
    total_price: number;
}