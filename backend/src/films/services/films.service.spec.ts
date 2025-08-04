import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FilmRepository } from '../../repository/film.repository';

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: FilmRepository;

  const mockFilmRepository = {
    findAll: jest.fn(),
    findScheduleById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmRepository,
          useValue: mockFilmRepository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    repository = module.get<FilmRepository>(FilmRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllFilms', () => {
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

      mockFilmRepository.findAll.mockResolvedValue(expectedResult);

      const result = await service.getAllFilms();

      expect(result).toEqual(expectedResult);
      expect(repository.findAll).toHaveBeenCalled();
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

      mockFilmRepository.findScheduleById.mockResolvedValue(expectedResult);

      const result = await service.getFilmSchedule(filmId);

      expect(result).toEqual(expectedResult);
      expect(repository.findScheduleById).toHaveBeenCalledWith(filmId);
    });
  });
});
