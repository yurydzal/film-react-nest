import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    it('should create order', async () => {
      const expectedResult = {
        total: 1,
        items: [
          {
            ...mockOrderDto.tickets[0],
            id: 'generated-uuid',
            status: 'confirmed',
          },
        ],
      };

      mockOrderService.createOrder.mockResolvedValue(expectedResult);

      const result = await controller.createOrder(mockOrderDto);

      expect(result).toEqual(expectedResult);
      expect(service.createOrder).toHaveBeenCalledWith(mockOrderDto);
    });
  });
});
