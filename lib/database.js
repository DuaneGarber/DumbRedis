'use strict';

/**
 * Database object that will hold all of the data for this test
 */
class Database {
  constructor () {
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
  set (key, value) {
    if (!key || !value) {
      console.error('ERR - get - Key or value not provided');
      return false;
    }

    let thisDb = this._getDb();
    // Set the Key on the current environment
    thisDb[key] = value;
  }

  /**
   * Get the value from a key
   *
   * Run Time: O(1)
   * Expects: Key to check for
   * Returns: returns value
   */
  get (key) {
    let thisDb = this._getDb();
    // Get the Key on current environment db or output NULL
    return thisDb[key] || undefined;
  }

  /**
   * Delete a key
   *
   * Run Time: O(1)
   * Expects: Key to unset
   * Returns: nothing
   */
  del (key) {
    let thisDb = this._getDb();

    // Delete the Key on the current environment
    delete thisDb[key];
  }

  /**
   * Checks all values currently stored, and returns the count of equal values
   *
   * Run Time: O(n)
   * Expects: value to find
   * Returns: count result
   */
  numberEqualTo (value) {
    let thisDb = this._getDb();
    let count = 0;

    for (let key in thisDb) {
      if (thisDb[key] === value) {
        count++;
      }
    }
    return count;
  }

  /**
   * Gets the current Database state
   *
   */
  _getDb () {
    let transLength = this.transactions.length;
    return transLength ? this.transactions[transLength - 1] : this.data;
  }

  /**
   * Begins a transaction
   *
   * A transaction is simply a cloned version of the current db
   *
   * Run Time: O(1)
   * Expects: nothing
   * Returns: nothing
   */
  begin () {
    // Push a new db copy
    let copy = Object.assign({}, this.data, ...this.transactions);
    this.transactions.push(copy);
  }

  /**
   * Rolls a transaction back
   *
   * Simply pops the transaction off the stack
   *
   * Run Time: O(1)
   * Expects: nothing
   * Returns: nothing
   */
  rollback () {
    if (this.transactions.length) {
      this.transactions.pop();
    } else {
      console.log('NO TRANSACTION');
    }
  }

  /**
   * Commit transaction to the DB
   *
   * Copies the data down stream to the permenant DB
   *
   * Run Time: O(1)
   * Expects: nothing
   * Returns: nothing
   */
  commit () {
    if (this.transactions.length) {
      // Commit all data the the permenant db
      Object.assign(this.data, ...this.transactions);

      // Empty the Transactions
      this.transactions = [];
    } else {
      console.log('NO TRANSACTION');
    }
  }
}

module.exports = Database;
