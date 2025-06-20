import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';

import { CustomLogger } from './app-logger';

const typeOrmLogger = new CustomLogger();

export class TypeOrmCustomLogger implements TypeOrmLogger {
  shortMsg(message: string) {
    return typeof message === 'string' && message.length > 50
      ? message.slice(0, 50) + '...'
      : message;
  }
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    typeOrmLogger.log?.(
      `[QUERY] ${this.shortMsg(query)}${parameters && parameters.length ? this.shortMsg(` -- [${parameters.join(', ')}]`) : ''}`,
    );
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    typeOrmLogger.error?.(
      `[ERROR] orm error\nQuery: ${this.shortMsg(query)}${parameters && parameters.length ? this.shortMsg(` -- [${parameters.join(', ')}]`) : ''}`,
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    typeOrmLogger.warn?.(
      `[SLOW] (${time}ms) orm slow query\nQuery: ${this.shortMsg(query)}${parameters && parameters.length ? this.shortMsg(` -- [${parameters.join(', ')}]`) : ''}`,
    );
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    typeOrmLogger.verbose?.(`[SCHEMA] ${this.shortMsg(message)}`);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    typeOrmLogger.verbose?.(`[MIGRATION] ${this.shortMsg(message)}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    if (level === 'log') typeOrmLogger.log?.(this.shortMsg(message));
    if (level === 'info') typeOrmLogger.verbose?.(this.shortMsg(message));
    if (level === 'warn') typeOrmLogger.warn?.(this.shortMsg(message));
  }
}
