"use strict";

var execSync = require("child_process").execSync;
var fs = require("fs");
var path = require("path");
var URL = require("url").URL;

var cheerio = require("cheerio");
var urls, errors;

function pluralize(str, array) {
  return String(array.length) + " " + str + (array.length === 0 ? "" : "s");
}

function findPages(directory) {
  var pages = [];
  var contents = fs.readdirSync(directory);

  contents.forEach(function(item) {
    var fullPath = path.join(directory, item);

    if (fs.statSync(fullPath).isDirectory()) {
      pages.push.apply(pages, findPages(fullPath));
    } else if (/\.html$/i.test(fullPath)) {
      pages.push(fullPath);
    }
  });
  return pages;
}

function findUrls(page) {
  var $ = cheerio.load(fs.readFileSync(page, { encoding: "utf-8" }));

  return $("a[href]").toArray()
    .map(function(el) { return new URL($(el).attr("href"), "https://jshint.com"); })
}

function validate(pair) {
  var page = pair[0];
  var url = pair[1];
  var pathname;

  if (url.host === "jshint.org") {
    return ["jshint.org reference", page, url];
  } else if (url.host !== "jshint.com") {
    return;
  }

  pathname = path.join("site", url.pathname);

  if (!fs.existsSync(pathname)) {
    pathname = path.join(pathname, "index.html");

    if (!fs.existsSync(pathname)) {
      return ["Could not resolve internal URL", page, url];
    }
  }
}

execSync("npm run build", { stdio: "inherit" });

urls = findPages("site")
  .reduce(function(accum, page) {
    return accum.concat(findUrls(page)
      .map(function(url) { return [page, url]; }));
  }, []);

errors = urls
  .map(validate)
  .filter(function(element) { return !!element; })

console.log("Validated " + pluralize("URL", urls) + ".");
console.log("Found " + pluralize("error", errors) + ".");

if (!urls.length) {
  throw new Error("Failed to locate any URLs.");
}

if (errors.length) {
  console.log(errors.join("\n").replace(/^/gm, "- "));
}

process.exitCode = Number(errors.length > 0);
