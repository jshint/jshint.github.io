{
  "template": "docs",
  "blog": true,
  "title": "JSHint 3 plans",
  "author": "Anton Kovalyov",
  "date": "2013-10-08",
  "url": "/blog/jshint-3-plans"
}

# JSHint 3 plans

A few weeks ago we shipped the new JSHint website and it seemed like
people liked it! In this blog post, I'd like to share my plans for the
next major release of JSHint.

The next release will be a backwards incompatible release in which I plan
to clean up and simplify our core package. Here are my current goals
for that release:

* Remove all style-related options and warnings. If it makes sense they
should be moved into optional plugins.
* Simplify options. All options should enable some sort of a warning with
some of them enabled by default.
* Build a foundation for plugins by exposing AST and adding additional
hooks.
* Redesign the API. Since it is a backwards incompatible release, I
think it could be a great opportunity to change our API from `JSHINT(...) &&
JSHINT.data()` to something better.

As you can guess from my goals, I don't consider JSHint to be a style tool.
I strongly believe that there's a market for a good JavaScript style and
formatting tool, but I don't think it should be JSHint's job.

JSHint is *really good* at giving programmers insight into their code
and I plan to iterate and improve that side of it. For example,
wouldn't it be nice if JSHint could not only warn about undefined variables
but also [detect if that undefined variable is the result of a typo](http://anton.kovalyov.net/p/js-typos/)?

Today many editors, IDEs and teaching services use JSHint to do static
analysis. The next major release will be about making their life easier.
If you're using JSHint within your product or organization and have feedback
on how you'd like JSHint to be improved, now is a perfect time to
[send me an email](mailto:anton@kovalyov.net).

### Don't panic

This doesn't mean there won't be any updates to the current stable branch (2.x)
of JSHint until 3 is ready. There will be changes, bug fixes and new features
published soon.
