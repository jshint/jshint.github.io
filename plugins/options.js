"use strict";
var fs = require("fs")
var dox = require("dox");
var marked = require("marked");

var optionsSrc = __dirname + "/../res/jshint/src/options.js";
var deprecationMsg = "<strong>Warning</strong> This option has been " +
  "deprecated and will be removed in the next major release of JSHint."

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

function getDeprecationReason(annotation) {
  var tags = annotation.tags;
  var idx, length, tag;

  if (!tags) {
    return null;
  }

  for (idx = 0, length = tags.length; idx < length; ++idx) {
    tag = tags[idx];
    if (tag.type === 'deprecated') {
      return tag.string;
    }
  }

  return null;
}

options.annotations.map(function(annotation) {
  var name = annotation.code.split(":")[0];
  var option = options.parsed[name];

  annotation.name = name.trim();
  annotation.category = getCategory(annotation);
  annotation.deprecationReason = getDeprecationReason(annotation);

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
    var description = '';

    if (annotation.deprecationReason) {
      description += "<div class='deprecation-msg'>" + deprecationMsg + " " +
        // TODO: Remove this when the `dox` module is updated to also parse
        //       annotations for Markdown.
        // See:  "Parse tag strings with Markdown"
        //       https://github.com/tj/dox/pull/139
        marked(annotation.deprecationReason) +
        "</div>";
    }

    description += annotation.description.full;

    return [
      "<tr>",
        "<td class='name' id='" + name + "'>",
          "<a href='#" + name + "'>" + name + "</a>",
        "</td>",
        "<td class='desc'>" + description + "</td>",
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
