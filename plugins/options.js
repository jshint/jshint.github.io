"use strict";
var fs = require("fs")
var dox = require("dox");

var optionsSrc = __dirname + "/../res/jshint/src/options.js";

dox.setMarkedOptions({
  breaks: false
});

var options = {
  src: fs.readFileSync(optionsSrc, { encoding: "utf-8" }),
  parsed: require(optionsSrc),
  byCategory: {
    enforcers: [],
    relaxers: [],
    environments: [],
    legacy: []
  }
};

options.annotations = dox.parseComments(options.src);

function getCategory(annotation) {
  var value = null;
  var name = annotation.ctx.name;

  if (name in options.parsed.bool.enforcing || name in options.parsed.val) {
    name = "enforcers";
  } else if (name in options.parsed.bool.relaxing) {
    name = "relaxers";
  } else if (name in options.parsed.bool.environments) {
    name = "environments";
  } else {
    throw new Error("Category not recognized for option ", name);
  }

  return name;
}

options.annotations.map(function(annotation) {
  var name = annotation.code.split(":")[0];
  var option = options.parsed[name];

  annotation.name = name.trim();
  annotation.category = getCategory(annotation);

  return annotation;
}).forEach(function(annotation) {
  options.byCategory[annotation.category].push(annotation);
});

Object.keys(options.byCategory).forEach(function(category) {
  options.byCategory[category].sort(function(a, b) {
    return a.name > b.name ? 1 : -1;
  });
});

function table2html(annotations) {
  var header = "<table class='options table table-bordered table-striped'>";
  var footer = "</table>";

  return header + annotations.map(function(annotation) {
    var name = annotation.name;

    return [
      "<tr>",
        "<td class='name' id='" + name + "'>",
          "<a href='#" + name + "'>" + name + "</a>",
        "</td>",
        "<td class='desc'>" + annotation.description.full + "</td>",
      "</tr>"
    ].join("\n");
  }).join("\n") + footer;
}

module.exports = function (site, handlebars) {
  var cats = [ "enforcers", "environments", "legacy", "relaxers" ];

  cats.forEach(function (cat) {
    handlebars.registerHelper("show-" + cat, function () {
      return new handlebars.SafeString(table2html(options.byCategory[cat]))
    })
  })

  return site
}
