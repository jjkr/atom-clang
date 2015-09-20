'use babel';

import fs from 'fs';
import path from 'path';
import winston from 'winston';

function touch(f) {
  fs.closeSync(fs.openSync(debugLogFile, 'a'));
}

class AtomConsoleTransport extends winston.Transport {
  constructor(options) {
    super();
    this.name = 'atomLogger';
    this.level = options.level || 'info';
  }
  log(level, msg, meta, done) {
    console.log(level + ': ' + msg);
    done(null, true);
  }
}

winston.transports.AtomConsoleTransport = AtomConsoleTransport;

const debugLogFile = path.join(__dirname, '../log/debug.log');
touch(debugLogFile);
const exceptionLogFile = path.join(__dirname, '../log/exceptions.log');
touch(exceptionLogFile);

const log = new winston.Logger({
  transports: [
    new winston.transports.AtomConsoleTransport(
        {level: 'debug', json: false, timestamp: true}),
    new winston.transports.File({filename: debugLogFile, json: false})
  ],
  exceptionHandlers: [
    new winston.transports.AtomConsoleTransport(
        {json: false, timestamp: true}),
    new winston.transports.File({
      filename: path.join(__dirname, '../log/exceptions.log'),
      json: false
    })
  ],
  exitOnError: false
});

export default log;
