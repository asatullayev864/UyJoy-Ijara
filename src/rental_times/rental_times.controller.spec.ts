import { Test, TestingModule } from '@nestjs/testing';
import { RentalTimesController } from './rental_times.controller';
import { RentalTimesService } from './rental_times.service';

describe('RentalTimesController', () => {
  let controller: RentalTimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalTimesController],
      providers: [RentalTimesService],
    }).compile();

    controller = module.get<RentalTimesController>(RentalTimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
