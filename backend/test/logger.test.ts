import { Test } from '@nestjs/testing';
import { TskvLogger } from '../src/loggers/tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TskvLogger],
    }).compile();

    logger = module.get<TskvLogger>(TskvLogger);
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('должен возвращать TSKV формат', () => {
    const message = 'Test message';
    logger.log(message);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleSpy.mock.calls[0][0];
    expect(loggedMessage).toMatch(
      /^tskv\ttimestamp=.+\tlevel=INFO\tmessage=Test message$/,
    );
  });
});
