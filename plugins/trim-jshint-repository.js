/**
 * Skip non-essential files in the JSHint repository to optimize build duration
 * and to avoid false negatives when validating generated content via the `npm
 * test` command.`
 */
"use strict";

var assert = require("assert");

module.exports = function (site) {
  var originalLength = site.resources.length;

  site.resources = site.resources.filter(function(resource, index) {
      var path = resource.meta.path;
      return !/^jshint\//.test(path) || /^jshint\/dist\//.test(path);
    });

  assert(site.resources.length > 0);
  assert(site.resources.length < originalLength);

  return site;
};
