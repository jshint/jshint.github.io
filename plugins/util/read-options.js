"use strict";
var fs = require("fs");

var dox = require("dox");
dox.setMarkedOptions({
  breaks: false
});

function getCategory(annotation, options) {
  var value = null;
  var name = annotation.ctx.name;

  if (name in options.parsed.bool.enforcing || name in options.parsed.val) {
    name = "enforcers";
  } else if (name in options.parsed.bool.relaxing) {
    name = "relaxers";
  } else if (name in options.parsed.bool.environments) {
    name = "environments";
  } else if (name === "unstable" || name in options.parsed.unstable) {
    name = "unstable";
  } else {
    throw new Error("Category not recognized for option '" + name + "'");
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

module.exports = function(path) {
  var options = {
    src: fs.readFileSync(path, { encoding: "utf-8" }),
    parsed: require(path),
    byCategory: {
      enforcers: [],
      relaxers: [],
      environments: [],
      legacy: [],
      unstable: []
    }
  };

  options.annotations = dox.parseComments(options.src);

  options.annotations.map(function(annotation) {
    var name = annotation.code.split(":")[0];
    var option = options.parsed[name];

    annotation.name = name.trim();
    annotation.category = getCategory(annotation, options);
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

  return options.byCategory;
};
