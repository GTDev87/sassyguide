'use strict';

var test = require('tape');
var request = require('supertest');
var proj = require('../src');

test('Correct users returned', function (t) {
  const parse = proj.componentCssBase(__dirname + '/fixture/component.scss');
  const mapping = {};
  const classNames = parse.classNames;
  const css = parse.parse(__dirname + '/fixture/utility.scss', mapping);

  console.log("css = %j", css);

  // t.error(err, 'No error');
  // t.same(res.body, expectedUsers, 'Users as expected');
  t.end();
});