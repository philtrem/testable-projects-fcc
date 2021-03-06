/*
 * Automates testing of all of the testable projects on CodePen.
 *
 * This file is just the Mocha related part of the tests. All the browser
 * automation takes place in the automatedTestUtils.js file.
 *
 * To run all the tests, from the command line:
 *   node_modules/mocha/bin/mocha
 *
 * To run one test or some tests, you can use the grep flag of Mocha. The
 * following will run only the tests with "D3" in the name. Note the names
 * come from the array of tests below in the code.
 *   node_modules/mocha/bin/mocha -g 'D3'
 *
 */

// Selenium wrapper for Mocha testing. You can also add the following if
// needed: after, afterEach, before, beforeEach, and xit.
import { describe, it } from 'selenium-webdriver/testing';
import { assert } from 'chai';

import tests from '../src/project-tests';
import { doesProjectPassTests } from './automate/automate-utils';

// Mocha or Selenium is creating more than the max default of 10 events
// emitters, so we increase the default max here.
require('events').EventEmitter.defaultMaxListeners = 20;

describe('Projects Tests', function() {
  // Mocha timeout. Two minutes should be enough for every page we test.
  this.timeout(120000);

  Object.keys(tests).forEach(function(key) {
    let test = tests[key];
    global.browsers.forEach(browser =>
      it(`Project "${test.name}" in ${browser} should pass all tests`, () =>
        doesProjectPassTests(browser, test.name, test.URL).then(success =>
          assert.isOk(
            success,
            `Project "${test.name}" in ${browser} did not pass all tests. ` +
              'See screenshot for more details.'
          )
        ))
    );
  });
});
