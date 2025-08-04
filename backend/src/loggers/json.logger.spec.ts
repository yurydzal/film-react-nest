import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log message', () => {
    logger.log('test message', { key: 'value' });
    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const expectedJson = JSON.stringify({
      level: 'log',
      message: 'test message',
      optionalParams: [{ key: 'value' }],
    });

    expect(consoleSpy).toHaveBeenCalledWith(expectedJson);
  });
});
