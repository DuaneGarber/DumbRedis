'use strict';
const Database = require('./lib/database');

process.stdin.resume();
process.stdin.setEncoding('ascii');
let input = '';
process.stdin.on('data', function (chunk) {
  input += chunk;
});

process.stdin.on('end', function () {
  const db = new Database();

  // Map Entered commands to the proper functions
  const COMMAND_MAP = {
    SET: (k, v) => db.set(k, v),
    GET: (k) => db.get(k),
    UNSET: (k) => db.del(k),
    NUMEQUALTO: (v) => db.numberEqualTo(v),
    END: () => {},
    BEGIN: () => db.begin(),
    ROLLBACK: () => db.rollback(),
    COMMIT: () => db.commit()
  };

  input.split('\n').forEach((line) => {
    let parts = line.trim().split(' ');
    let command = parts[0] || false;
    let firstArg = parts[1] || false;
    let secondArg = parts[2] || false;

    if (COMMAND_MAP[command]) {
      // Take advantage of the fact we can pass extra args
      COMMAND_MAP[command](firstArg, secondArg);
    } else {
      // Invalid Command! -- IGNORE?
    }
  });
});
