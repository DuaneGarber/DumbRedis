'use strict';

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
    UNSET: (k) => db.unset(k),
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

/**
 * Database object that will hold all of the data for this test
 */
function Database () {
  // This is essentially the database
  this.data = {};
  // This contains all of the non committed data
  this.transactions = [];
}

/**
 * Sets a key to a value
 *
 * Run Time: O(1)
 * Expects: Key and Value to be set
 * Returns: nothing
 */
Database.prototype.set = function (key, value) {
  // Check if we have active transactions
  let transLength = this.transactions.length;
  let thisDb = transLength ? this.transactions[transLength - 1] : this.data;
  // Set the Key on the current environment
  thisDb[key] = value;
};

/**
 * Get the value from a key
 *
 * Run Time: O(1)
 * Expects: Key to check for
 * Returns: nothing (consoles out the value)
 */
Database.prototype.get = function (key) {
  // Check if we have active transactions
  let transLength = this.transactions.length;
  let thisDb = transLength ? this.transactions[transLength - 1] : this.data;
  // Get the Key on current environment db or output NULL
  console.log(thisDb[key] || 'NULL');
};

/**
 * Unset a key
 *
 * Run Time: O(1)
 * Expects: Key to unset
 * Returns: nothing
 */
Database.prototype.unset = function (key) {
  // Check if we have active transactions
  let transLength = this.transactions.length;
  let thisDb = transLength ? this.transactions[transLength - 1] : this.data;
  // Delete the Key on the current environment
  delete thisDb[key];
};

/**
 * Checks all values currently stored, and returns the count of equal values
 *
 * Run Time: O(n)
 * Expects: value to find
 * Returns: nothing (consoles out the result)
 */
Database.prototype.numberEqualTo = function (value) {
  let transLength = this.transactions.length;
  let thisDb = transLength ? this.transactions[transLength - 1] : this.data;
  let count = 0;

  for (let key in thisDb) {
    if (this.data[key] === value) {
      count++;
    }
  }
  console.log(count);
};

/**
 * Begins a transaction
 *
 * A transaction is simply a cloned version of the current db
 *
 * Run Time: O(1)
 * Expects: nothing
 * Returns: nothing
 */
Database.prototype.begin = function () {
  // Push a new db copy
  let copy = Object.assign({}, this.data, ...this.transactions);
  this.transactions.push(copy);
};

/**
 * Rolls a transaction back
 *
 * Simply pops the transaction off the stack
 *
 * Run Time: O(1)
 * Expects: nothing
 * Returns: nothing
 */
Database.prototype.rollback = function () {
  if (this.transactions.length) {
    this.transactions.pop();
  } else {
    console.log('NO TRANSACTION');
  }
};

/**
 * Commit transaction to the DB
 *
 * Copies the data down stream to the permenant DB
 *
 * Run Time: O(1)
 * Expects: nothing
 * Returns: nothing
 */
Database.prototype.commit = function () {
  if (this.transactions.length) {
    // Commit all data the the permenant db
    Object.assign(this.data, ...this.transactions);

    // Empty the Transactions
    this.transactions = [];
  } else {
    console.log('NO TRANSACTION');
  }
};
