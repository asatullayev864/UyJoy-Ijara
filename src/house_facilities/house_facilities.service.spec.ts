import { Test, TestingModule } from '@nestjs/testing';
import { HouseFacilitiesService } from './house_facilities.service';

describe('HouseFacilitiesService', () => {
  let service: HouseFacilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HouseFacilitiesService],
    }).compile();

    service = module.get<HouseFacilitiesService>(HouseFacilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
