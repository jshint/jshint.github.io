"use script";

var sqwish = require("sqwish")
var uglify = require("uglify-js")

module.exports = function (site, handlebars) {
  if (site.dev)
    return site

  var styles = {
    "bootstrap.css":  true,
    "codemirror.css": true,
    "styles.css":     true
  }

  var css = site.resources.map(function (res) {
    if (styles[res.meta.path])
      return res.data
    return ""
  }).join("\n")

  site.resources.push({
    meta: { path: "index.min.css", binary: true },
    data: sqwish.minify(css)
  })

  css = site.resources.map(function (res) {
    if (res.meta.path === "bootstrap.css" || res.meta.path === "docs.css")
      return res.data
    return ""
  }).join("\n")

  site.resources.push({
    meta: { path: "docs.min.css", binary: true },
    data: sqwish.minify(css)
  })


  var scripts = {
    "codemirror.js": true,
    "javascript.js": true,
    "index.js":      true
  }

  var js = site.resources.map(function (res) {
    if (scripts[res.meta.path])
      return res.data
    return ""
  }).join("\n")

  // uglify is breaking the website for some reason :-\
  // uglify.minify(js, { fromString: true, mangle: false, compress: false }).code

  site.resources.push({
    meta: { path: "scripts.min.js", binary: true },
    data: js
  })

  return site 
}