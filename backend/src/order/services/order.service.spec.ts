import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { FilmRepository } from '../../repository/film.repository';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from '../dto/order.dto';
import { ConflictException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;

  const mockFilmRepository = {
    updateTakenSeats: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: FilmRepository,
          useValue: mockFilmRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    const mockOrderDto: CreateOrderDto = {
      email: 'test@test.com',
      phone: '+1234567890',
      tickets: [
        {
          film: 'film-id',
          session: 'session-id',
          daytime: '2024-08-04T10:00:00',
          row: 1,
          seat: 1,
          price: 350,
        },
      ],
    };

    it('should create order successfully', async () => {
      mockFilmRepository.updateTakenSeats.mockResolvedValue(undefined);

      const result = await service.createOrder(mockOrderDto);

      expect(result.total).toBe(1);
      expect(result.items[0]).toEqual(
        expect.objectContaining({
          film: 'film-id',
          session: 'session-id',
          status: 'confirmed',
        }),
      );
      expect(mockFilmRepository.updateTakenSeats).toHaveBeenCalledWith(
        'film-id',
        'session-id',
        '1:1',
      );
    });

    it('should throw error when seat is already taken', async () => {
      mockFilmRepository.updateTakenSeats.mockRejectedValue(
        new ConflictException('Seat already taken'),
      );

      await expect(service.createOrder(mockOrderDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
