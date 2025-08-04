import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from '../services/films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilmsService = {
    getAllFilms: jest.fn(),
    getFilmSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFilms', () => {
    it('should return all films', async () => {
      const expectedResult = {
        total: 2,
        items: [
          {
            id: '1',
            title: 'Film 1',
            schedule: [],
          },
          {
            id: '2',
            title: 'Film 2',
            schedule: [],
          },
        ],
      };

      mockFilmsService.getAllFilms.mockResolvedValue(expectedResult);

      const result = await controller.getFilms();

      expect(result).toEqual(expectedResult);
      expect(service.getAllFilms).toHaveBeenCalled();
    });
  });

  describe('getFilmSchedule', () => {
    it('should return schedule for specific film', async () => {
      const filmId = '1';
      const expectedResult = {
        total: 1,
        items: [
          {
            id: 'schedule1',
            filmId: '1',
            daytime: '2024-08-04T10:00:00',
            hall: 1,
            taken: [],
          },
        ],
      };

      mockFilmsService.getFilmSchedule.mockResolvedValue(expectedResult);

      const result = await controller.getFilmSchedule(filmId);

      expect(result).toEqual(expectedResult);
      expect(service.getFilmSchedule).toHaveBeenCalledWith(filmId);
    });
  });
});
