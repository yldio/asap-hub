import debug from 'debug';
import { Logger, createLogger, transports } from 'winston';
import { logLevel } from '../config';

const logger = debug('asap-server');
export default logger;

const LEVEL = Symbol.for('level');
const MESSAGE = Symbol.for('message');

export const loggerFactory = (): Logger =>
  createLogger({
    level: logLevel,
    transports: [
      new transports.Console({
        // swapping console._stdout.write for normal console.logs and errors
        // this enables request ID printing in cloudwatch
        log(this: transports.ConsoleTransportInstance, info, callback) {
          setImmediate(() => this.emit('logged', info));

          if (this.stderrLevels[info[LEVEL]]) {
            // eslint-disable-next-line no-console
            console.error(info[MESSAGE]);

            if (callback) {
              callback();
            }
            return;
          }

          // eslint-disable-next-line no-console
          console.log(info[MESSAGE]);

          if (callback) {
            callback();
          }
        },
      }),
    ],
    exitOnError: false,
  });
