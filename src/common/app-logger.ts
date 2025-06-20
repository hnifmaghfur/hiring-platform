import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class CustomLogger implements LoggerService {
  log(message: string) {
    // Biru
    console.log(
      `[${new Date().toISOString()}] \x1b[34m[LOG]\x1b[0m ${message}`,
    );
  }

  error(message: string, trace?: string) {
    // Merah
    console.error(
      `[${new Date().toISOString()}] \x1b[31m[ERROR]\x1b[0m ${message} ${trace || ''}\x1b[0m`,
    );
  }

  warn(message: string) {
    // Kuning
    console.warn(
      `[${new Date().toISOString()}] \x1b[33m[WARN]\x1b[0m ${message}\x1b[0m`,
    );
  }

  debug?(message: string) {
    // Magenta
    console.debug(
      `[${new Date().toISOString()}] \x1b[35m[DEBUG]\x1b[0m ${message}\x1b[0m`,
    );
  }

  verbose?(message: string) {
    // Cyan
    console.info(
      `[${new Date().toISOString()}] \x1b[36m[VERBOSE]\x1b[0m ${message}\x1b[0m`,
    );
  }
}
