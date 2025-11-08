import { Test, TestingModule } from '@nestjs/testing';
import { RentalTimesService } from './rental_times.service';

describe('RentalTimesService', () => {
  let service: RentalTimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentalTimesService],
    }).compile();

    service = module.get<RentalTimesService>(RentalTimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
