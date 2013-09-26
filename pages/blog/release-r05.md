{
  "template": "docs",
  "blog": true,
  "title": "New release: r05",
  "date": "2012-01-19",
  "url": "/blog/2012-01-19/release-r05"
}

# New release: r05

This release improves JSHint's support for variable hoisting. JSHint
now fully understands variable hoisting:

    /*jshint undef:true */

        function func() {
          function innerOne() {
              // Before: wrong error.
                // Now: knows that innerTwo is defined below.
                innerTwo();
            }

            function innerTwo() {
            }
        }

We also added a new option, `laxcomma`, that allows you to use
comma-first coding style without turning on the `laxbreak` option. See
[GH-340](https://github.com/jshint/jshint/pull/340) for more information.

Thanks to Charlie Robbins.
