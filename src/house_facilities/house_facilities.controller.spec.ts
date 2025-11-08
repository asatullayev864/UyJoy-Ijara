import { Test, TestingModule } from '@nestjs/testing';
import { HouseFacilitiesController } from './house_facilities.controller';
import { HouseFacilitiesService } from './house_facilities.service';

describe('HouseFacilitiesController', () => {
  let controller: HouseFacilitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HouseFacilitiesController],
      providers: [HouseFacilitiesService],
    }).compile();

    controller = module.get<HouseFacilitiesController>(HouseFacilitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
