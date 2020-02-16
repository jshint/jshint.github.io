"use strict";
var fs = require("fs");
var translateFencedCode = require("./util/fenced-code");

module.exports = function (site, handlebars) {
  handlebars.registerHelper("fromRepository", function (source) {
    return new handlebars.SafeString(
      translateFencedCode(
        fs.readFileSync("res/jshint/" + source, { encoding: "utf-8" })
      )
    );
  });

  return site;
};
