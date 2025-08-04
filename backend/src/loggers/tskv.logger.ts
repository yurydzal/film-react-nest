import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: any, ...optionalParams: any[]) {
    return `level=${level}\tmessage=${message}\tdata=${JSON.stringify(optionalParams)}\n`;
  }
  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  fatal(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('fatal', message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('debug', message, ...optionalParams));
  }
}
