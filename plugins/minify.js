"use script";

var sqwish = require("sqwish")
var uglify = require("uglify-js")

module.exports = function (site, handlebars) {
  if (site.dev)
    return site

  var index   = [ "bootstrap.css", "codemirror.css", "styles.css" ]
  var docs    = [ "bootstrap.css", "docs.css" ]
  var scripts = [ "codemirror.js", "javascript.js", "index.js" ]
  var jshint  = [ "jshint/dist/jshint.js" ]

  function combine(names) {
    var out = ""
    names.forEach(function (name) {
      site.resources.map(function (res) {
        if (res.meta.path === name) out += res.data + "\n"
      })
    })
    return out
  }

  site.resources.push(
    {
      meta: { path: "index.min.css", binary: true },
      data: sqwish.minify(combine(index))
    },

    {
      meta: { path: "docs.min.css", binary: true },
      data: sqwish.minify(combine(docs))
    },

    {
      meta: { path: "scripts.min.js", binary: true },
      data: uglify.minify(combine(scripts), { fromString: true, output: { ascii_only: true }}).code
    },

    {
      meta: { path: "jshint/dist/jshint.js", binary: true },
      data: uglify.minify(combine(jshint), { fromString: true, output: { ascii_only: true }}).code
    }
  );

  return site 
}