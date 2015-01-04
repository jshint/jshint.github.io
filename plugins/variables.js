/**
 * @file - Resolve any variables declared within Moustache templating
 * directives.
 */
"use strict";
var path = require("path");
var fs = require("fs");

var pkg = require(path.join(
  __dirname, "..", "node_modules", "jshint", "package.json")
);
var contributing = fs.readFileSync(
  "res/jshint/CONTRIBUTING.md", { encoding: "utf-8" }
);
var context = {
  contributionGuidelines: translateFencedCode(contributing),
  version: pkg.version,
  urls: {
    repo: "https://github.com/jshint/jshint",
    newIssue: "https://github.com/jshint/jshint/issues/new",
    newPullRequest: "https://github.com/jshint/jshint/compare"
  }
};

/**
 * The Markdown preprocessor used by Oddweb does not support the
 * "backtick"/"code fence" syntax for multiline code examples. If present,
 * these must be translated to the "indented" format.
 */
function translateFencedCode(markdown) {
  var openPattern = /^(\s*)```[\w]*\s*$/;
  var closePattern = /^\s*```\s*$/;
  var lines = markdown.split("\n");
  var state = { fixed: [], indent: '', isCode: false };

  lines.reduce(function(state, line) {
    var match;
    if (state.isCode) {
      if (closePattern.test(line)) {
        state.isCode = false;
      } else {
        state.fixed.push(state.indent + line);
      }
    } else {
      match = openPattern.exec(line);
      if (match) {
        state.isCode = true;
        state.indent = match[1] || '    ';
      } else {
        state.fixed.push(line);
      }
    }
    return state;
  }, state);

  return state.fixed.join("\n");
}

module.exports = function (site, handlebars) {
  site.pages.forEach(function(page) {
    var template = handlebars.compile(page.data);
    page.data = template(context);
  });

  return site;
};
