{ "title": "FAQ", "url": "/docs/faq", "template": "docs" }

# Frequently Asked Questions

### How do I turn off a *mixed tabs and spaces* warning?

If you're using so-called [smart tabs](http://www.emacswiki.org/SmartTabs)
then we have an option `smarttabs` for you. Otherwise, your solution is to
run JSHint with a custom reporter that discards any warnings you don't like.
For example, this [example reporter](https://gist.github.com/3885619)
discards all warnings about mixed tabs and spaces.

### JSHint skips some unused variables

If your code looks like this:

    function test(a, b, c) {
      return c;
    }

Then JSHint will not warn about unused variables `a` and `b` if you set the
`unused` option to `true`. It figures that if unused arguments are followed
by used ones, it was a conscious decision and not a typo. If you want to
warn about all unused variables not matter where they appear, set the `unused`
option to `strict`:

    /*jshint unused:strict */
    function test(a, b, c) {
      return c;
    }

    // Warning: unused variable 'a'
    // Warning: unused variable 'b'

For more information see: [options/unused](http://jshint.com/docs/options/#unused).