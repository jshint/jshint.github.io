"use strict";

var path = require("path")

module.exports = function (site, handlebars) {
  var dir = path.resolve(site.src)
  var pkg = require(path.join(dir, "node_modules", "jshint", "package.json"))
  var ver = pkg.version

  site.pages = site.pages.map(function (page) {
    page.data = page.data.replace(/\$version\$/g, ver)
    return page
  })

  return site
}