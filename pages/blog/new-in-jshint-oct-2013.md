{
  "template": "docs",
  "blog": true,
  "title": "What's new in JSHint (October, 2013)",
  "author": "Anton Kovalyov",
  "date": "2013-10-21",
  "url": "/blog/new-in-jshint-oct-2013"
}

# What's new in JSHint (October, 2013)

We shipped a couple of exciting new features in October. Here's a short
write-up about some of them.

### Ignore directive

Thanks to [Daniel Miladinov](https://github.com/danielmiladinov), JSHint
can now ignore blocks of code which makes it easier to use JSHint with
JavaScript language extensions such as [Facebook React](http://facebook.github.io/react/).

    // Code here will be linted with JSHint.
    /* jshint ignore:start */
    // Code here will be linted with ignored by JSHint.
    /* jshint ignore:end */

All code in between **ignore:start** and **ignore:end** won't be
passed to JSHint at all. Additionally, you can ignore a single
line with a trailing comment:

    ignoreThis(); // jshint ignore:line

### Checks for the *typeof* operator

Thanks to [Oleg Grenrus](https://github.com/phadej), JSHint can now
check the use of a **typeof** operator when its result is compared
to a string. This operator has only a limited set of possible return
values ([mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)).
If you try to compare it with an invalid value, JSHint will produce
a warning informing you about the issue. You can disable this check
with a **notypeof** option.

    // 'fuction' instead of 'function'
    if (typeof a == "fuction") { // Warning: Invalid typeof value 'fuction'
      /* ... */
    }

### New option: *freeze*

Thanks to [Caitlin Potter](https://github.com/caitp), there's a new
option—**freeze**—that prohibits the modification of native objects
such as Array, Number, Date, etc. It's generally a bad idea to modify
these objects unless you're absolutely sure you know what you're doing.

    /* jshint freeze:true */
    Array.prototype.count = function (value) { return 4; };
    // -> Warning: Extending prototype of native object: 'Array'.

This option is still under development. Do you have suggestions
on how we can improve it? [Tell us here](https://github.com/jshint/jshint/issues/1316).

### Changesets

We now use GitHub releases to host our changesets:

* [JSHint 2.3.0 changeset](https://github.com/jshint/jshint/releases/tag/2.3.0)
* [JSHint 2.2.0 changeset](https://github.com/jshint/jshint/releases/tag/2.2.0)
