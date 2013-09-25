---
layout: docs
title: Blog
subtitle: "New release: r11"
name: post
---

This release adds **new checks for excessive code**! You can now use JSHint
to check number of parameters per function, nested block depth per function,
number of statements per function and function's cyclomatic complexity.
More information in our [docs](/docs/) or in this brilliant
[patch](https://github.com/jshint/jshint/pull/593/).

Other changes:

* Fixed bugs where JSHint couldn't parse Number.NaN and ES5 sparse arrays.
* Fixed bugs where JSHint couldn't parse some confusing regular expressions.
* `catch` blocks now has their own scope so if you define a function within
  a catch block and try to use it outside of said block—JSHint will warn you
    about undefined variable. JSHint also warns about cases when the catch
    scope leaks values into the outer scope in IE:

      var e = 2;

      try {
        throw 'boom';
      } catch (e) {
        // JSHint: 'e' may get overwritten in IE.
      }

      console.log(e + 2); // 'boom2' instead of 4

* We no longer warn when Object is used as a function. Like Boolean, Number
  and String, Object can be called as a function which provides scripts with
    access to ECMAScript's internal ToObject logic.
* We no longer warn when uncapitalized global functions are used as constructors.
* JSHint now recognizes some ES6 globals (Map, Set and WeakMap) and one
  additional browser global Blob.
* Updated our list of globals for MooTools.
* JSHint can now check code within simple eval strings. For example, JSHint can
  now spot typos like this one (this practice is still discouraged, though):

      eval("oops("); // Expected ')' and instead saw ''.

* \+ other minor bugfixes.

Thanks to Josh Heidenreich, Rick Waldron, Nikolay Frantsev, shybyte.
