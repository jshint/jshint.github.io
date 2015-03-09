{ "title": "FAQ", "url": "/docs/faq", "template": "docs" }

# Frequently Asked Questions

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
