"use strict";
var openPattern = /^(\s*)```[\w]*\s*$/;
var closePattern = /^\s*```\s*$/;

/**
 * The Markdown preprocessor used by Oddweb does not support the
 * "backtick"/"code fence" syntax for multiline code examples. If present,
 * these must be translated to the "indented" format.
 */
module.exports = function(markdown) {
  var lines = markdown.split("\n");
  var state = { fixed: [], indent: '', isCode: false };

  lines.reduce(function(state, line) {
    var match;
    if (state.isCode) {
      if (closePattern.test(line)) {
        state.isCode = false;
      } else {
        state.fixed.push(state.indent + line);
      }
    } else {
      match = openPattern.exec(line);
      if (match) {
        state.isCode = true;
        state.indent = match[1] || '    ';
      } else {
        state.fixed.push(line);
      }
    }
    return state;
  }, state);

  return state.fixed.join("\n");
}

