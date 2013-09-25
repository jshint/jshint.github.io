"use strict";

var fs       = require("fs")
var path     = require("path")
var markdown = require("markdown").markdown;

function table2html(src) {
  var header = "<table class='options table table-bordered table-striped'>";
  var footer = "</table>";

  return header + src.split("\n--").map(function (row) {
    var lines = row.trim().split("\n");
    var desc = markdown.toHTML(lines.slice(1).join("\n").trim());
    var name = lines[0];

    return [
      "<tr>",
        "<td class='name' id='" + name + "'><a href='#" + name + "'>" + name + "</a></td>",
        "<td class='desc'>" + desc + "</td>",
      "</tr>"
    ].join("\n");
  }).join("\n") + footer;
}

module.exports = function (site, handlebars) {
  var cats = [ "enforcers", "environments", "legacy", "relaxers" ];

  cats.forEach(function (cat) {
    handlebars.registerHelper("show-" + cat, function () {
      var src = fs.readFileSync(path.join("options", cat + ".table"), { encoding: "utf8" })
      return new handlebars.SafeString(table2html(src))
    })
  })

  return site
}