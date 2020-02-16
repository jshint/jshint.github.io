/**
 * @file - Resolve any variables declared within Moustache templating
 * directives.
 */
"use strict";
var path = require("path");
var fs = require("fs");
var marked = require("marked");
var readOptions = require("./util/read-options");
var optionsSrc = __dirname + "/../res/jshint/src/options.js";

var pkg = require(path.join(
  __dirname, "..", "res", "jshint", "package.json")
);
var context = {
  version: pkg.version,
  options: readOptions(optionsSrc),
  urls: {
    repo: "https://github.com/jshint/jshint",
    newIssue: "https://github.com/jshint/jshint/issues/new",
    newPullRequest: "https://github.com/jshint/jshint/compare",
    latestRelease: "https://github.com/jshint/jshint/releases/tag/" + pkg.version
  }
};

module.exports = function (site, handlebars) {
  var partialPattern = /^(.*)\.html$/i;

  handlebars.registerHelper("markdown", function (input) {
    return new handlebars.SafeString(marked(input));
  });

  fs.readdirSync("partials").forEach(function(filename) {
    var match = filename.match(partialPattern);

    if (!match) {
      return null;
    }

    handlebars.registerPartial(
      match[1],
      fs.readFileSync(path.join("partials", filename), { encoding: "utf-8" })
    );
  });

  site.pages.forEach(function(page) {
    var template = handlebars.compile(page.data);
    page.data = template(context);
  });

  return site;
};
