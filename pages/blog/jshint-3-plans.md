{
  "template": "docs",
  "blog": true,
  "title": "JSHint 3 plans",
  "date": "2013-10-08",
  "url": "/blog/jshint-3-plans"
}

# JSHint 3 plans

One week ago we shipped the new JSHint website and it seems like you
people liked it! In this blog post, I'd like to share my plans for the
next major release of JSHint.

The next release will be backwards incompatible release where I plan
to clean up and simplify our core package. Here are my current goals
for that release:

* Remove all style-related options and warnings. If it makes sense they
should be moved into optional plugins.
* Simplify options. All options should enable some sort
of a warning with some of them enabled by default.
* Build a foundation for plugins by exposing AST and adding additional
hooks.

TODO: Parallel development.
TODO: JSHint is not a style tool.