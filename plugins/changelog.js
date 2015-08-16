/**
 * @file - Generate a blog posts for each non-empty entry in the JSHint
 * project's `CHANGELOG.md` file.
 */
"use strict";
var fs = require("fs");

var antonDepartureDate = new Date(2014, 6, 22);
var headerPattern = new RegExp([
  '^#+',
  // Version:
  '\\[([^\\]]+)\\]',
  // URL:
  '\\(([^\\)]+)\\)',
  // Date:
  '\\(([^\\)]+)\\)'
].join('\\s*'), 'gm');
var anchorPattern = /^<a\s+name\b[^>]*><\/a>$/gim;

module.exports = function (site, handlebars) {
  var changelog = fs.readFileSync(
    "res/jshint/CHANGELOG.md", { encoding: "utf-8" }
  );

  var match;
  var releases = [];

  // Remove anchors
  changelog = changelog.replace(anchorPattern, "");

  while (match = headerPattern.exec(changelog)) {
    releases.push({
      version: match[1],
      url: match[2],
      date: match[3],
      headingStart: match.index,
      headingEnd: match.index + match[0].length
    });
  }

  releases.forEach(function(release, idx) {
    var until;

    if (idx < releases.length - 1) {
      until = releases[idx + 1].headingStart;
    } else {
      until = changelog.length;
    }

    release.content = changelog.slice(release.headingEnd, until).trim();
  });

  releases.forEach(function(release) {
    var slug;

    // Do not generate posts for releases with no associated release notes
    if (!release.content) {
      return;
    }

    slug = "release-" + release.version.replace(/[^a-z0-9_-]+/gi, "-");

    site.pages.push({
      meta: {
        template: "blog.html",
        blog: true,
        title: "New Release: " + release.version,
        date: release.date,
        url: "/blog/" + release.date + "/" + slug,
        path: "blog/" + release.date + "/" + slug + "/index.html",
        author: new Date(release.date) < antonDepartureDate ?
          "Anton Kovalyov" : "The JSHint team",
        type: "md"
      },
      data: release.content
    });
  });

  return site;
};
