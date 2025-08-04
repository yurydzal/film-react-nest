import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should format message in TSKV format', () => {
    const message = 'test message';
    const params = { key: 'value' };

    logger.log(message, params);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        /^level=log\s+message=test message\s+data=\[.*\]\s*$/,
      ),
    );
  });
});
