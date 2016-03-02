'use strict';
const test = require('tape');
const Database = require('../lib/database');

test('Basic DB Testing', function (t) {
  t.plan(25);
  let testDb = new Database();

  t.equal(testDb.get('doesnotexist'), undefined, 'Getting unregistered key returns undefined');
  t.equal(testDb.numberEqualTo(0), 0, 'Number equal to with an empty db is 0');

  t.deepEqual(testDb._getDb(), {}, 'Empty DB is empty');

  testDb.set('emptyValue');
  t.equal(testDb.get('emptyValue'), undefined, 'Getting bad set value key returns undefined');

  testDb.set('value1', 10);
  testDb.set('value2', 20);
  testDb.set('value3', 10);

  t.equal(testDb.get('value1'), 10, 'Value 1 was set properly');
  t.equal(testDb.get('value2'), 20, 'Value 2 was set properly');

  t.equal(testDb.numberEqualTo(10), 2, 'Found 2 Results that are 10');
  t.equal(testDb.numberEqualTo(20), 1, 'Found 1 Results that are 20');

  t.deepEqual(testDb._getDb(), {value1: 10, value2: 20, value3: 10}, 'DB schema is as expected');

  testDb.del('value3');

  t.deepEqual(testDb.data, {value1: 10, value2: 20}, 'Value 3 has been deleted');

  // Start transaction
  testDb.begin();
  testDb.set('value3', 10);
  testDb.set('value4', 10);

  t.equal(testDb.numberEqualTo(10), 3, 'Found 3 Results that are 10 (In transaction)');

  t.deepEqual(testDb._getDb(), {value1: 10, value2: 20, value3: 10, value4: 10}, 'Data Has been added in the transaction');

  t.equal(testDb.rollback(), true, 'Rollback reported successful execution');
  t.equal(testDb.numberEqualTo(10), 1, 'Found 1 Results after rollback');
  t.deepEqual(testDb._getDb(), {value1: 10, value2: 20}, 'Rollback DB is as expected');

  testDb.begin();
  testDb.set('value5', 30);
  testDb.set('value6', 40);

  t.deepEqual(testDb._getDb(), {value1: 10, value2: 20, value5: 30, value6: 40}, 'Data Has been added in the transaction (before commit)');

  t.equal(testDb.commit(), true, 'Commit reported successful execution');
  t.deepEqual(testDb._getDb(), {value1: 10, value2: 20, value5: 30, value6: 40}, 'Data Has been added in the transaction (after commit)');

  testDb.begin();
  testDb.set('value5', 50);

  testDb.begin();

  t.equal(testDb.get('value5'), 50, 'Value5 is set to 50');
  t.equal(testDb.get('value6'), 40, 'Value6 is set inside 2nd transaction');

  testDb.del('value6');
  t.equal(testDb.get('value6'), undefined, 'Value6 is no longer set');

  testDb.rollback();
  t.equal(testDb.get('value6'), 40, 'Value6 is restored to 40');

  testDb.rollback();
  t.equal(testDb.get('value5'), 30, 'Value5 is restored to 30');

  t.equal(testDb.commit(), false, 'Commit reported failed execution');
  t.equal(testDb.commit(), false, 'Rollback reported failed execution');
});
