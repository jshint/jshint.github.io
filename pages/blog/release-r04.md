{
  "template": "blog",
  "blog": true,
  "title": "Bugfix release: r04",
  "author": "Anton Kovalyov",
  "date": "2012-01-08",
  "url": "/blog/2012-01-08/release-r04"
}

This is a bugfix release that also contains some improvements to our
test coverage.

Fixes:

* JSHint now makes sure that `null` references are not subscripted
  within `typeof` and `delete` operators.

* JSHint now recognizes defensive semicolon technique:

      ; (function () { /* ... */ }());

    But still warns in cases like this:

        ; function () {}

* Fixed an issue with `latedef` not working for a specific use
  of variable hoisting.

* Fixed an intermittent bug with JSHint failing with an exception
  instead of returning a Too Many errors message.

* Fixed incorrect comments in JSC wrapper.

* Fixed a bug with JSC wrapper not parsing options with spaces correctly.

Thanks to Mike Pennisi and Dan Vanderkam.
