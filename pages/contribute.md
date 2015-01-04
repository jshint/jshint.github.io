{ "title": "Contribute to JSHint", "url": "/contribute/", "template": "docs" }

# Contribute

Good news everyone, JSHint is open source! Our source code is hosted on
[GitHub](http://github.com/jshint/jshint/).

[![Build Status](https://travis-ci.org/jshint/jshint.png?branch=master)](https://travis-ci.org/jshint/jshint)

### How to contribute

The best way to make sure your issue is addressed is to submit a patch. We
accept patches through all mediums: pull requests, email, issue comment, tweet
with a link to a snippet, graffiti outside of Anton's apartment, etc.

However, before sending a patch, please make sure that the following applies:

* Your commit message links to that issue.
* Your commit message is very descriptive ([example](https://github.com/jshint/jshint/commit/5751c5ed249b7a035758a3ae876cfa1a360fd144)).
* Your patch doesn't have useless merge commits.
* Your coding style is similar to ours (see below).
* Your patch is 100% tested. We don't accept any test regressions.
* All tests and lint checks pass (`npm test`).
* You understand that we're super grateful for your patch.

### Bug Bounties

Some bugs are so important to us, we will pay you if you fix them! Go to
[our page on BountySource](https://www.bountysource.com/#trackers/48759-jshint)
to see which bugs have bounties behind them.

Really want to have something fixed but don't have time? You can add your
own bounty to any JSHint bug and make it more attractive for potential
contributors!

**Rule:** A bug is considered fixed only after it has been merged into the
master branch of the main JSHint repository.

### Development Environment

JSHint has a number of dependencies specified in its `package.json` file. To
install them just run the following command from within your repo directory:

    $ npm install

After that you will be able to run the edge version of JSHint using `bin/jshint`
or build the release bundles using `bin/build`.

### Coding Style

This section describes our coding style guide. You might not agree with it and
that's fine but if you're going to send us patches treat this guide as a law.

Our main rule is simple:

> All code in any code-base should look like a single person typed it, no matter how many people contributed. —[idiomatic.js](https://github.com/rwldrn/idiomatic.js/)

#### Whitespace:

* We use hard tabs everywhere.
* [Smart tabs](http://www.emacswiki.org/SmartTabs) are okay.
* Use one space after `if`, `for`, `while`, etc.
* Use one space after `function` for anonymous functions but not for named
  functions:

        var a = function () {};
        function a() {}

* Feel free to indent variable assignments or property definitions if it
  makes the code look better. But don't abuse that:

        // Good
        var next = token.peak();
        var prev = token.peak(-1);
        var cur  = token.current;

        var scope = {
          name:   "(global)",
          parent: parentScope,
          vars:   [],
          uses:   []
        };

        // Bad
        var cur         = token.current;
        var isSemicolon = cur.isPunctuator(";");

* Wrap multi-line comments with new lines on both sides.

#### Variables:

* Use one `var` per variable unless you don't assign any values to it (and it's
  short enough):

        var token = tokens.find(index);
        var scope = scopes.current;
        var next, prev, cur;

* Don't be overly descriptive with your variable names but don't abuse
  one-letter variables either. Find a sweet spot somewhere in between.

#### Comments:

* Use `//` for all comments.
* Comment everything that is not obvious.
* If you're adding a new check, write a comment describing why this check is
  important and what it checks for.

#### Misc:

* Always use strict mode.
* Always use strict comparisons: `===` and `!==`.
* Use semicolons.
* Don't use comma-first notation.
* Try not to chain stuff unless it **really** helps (e.g. in tests).
* Don't short-circuit expressions if you're not assigning the result:

        // Good
        token = token || tokens.find(0);

        // Bad
        token.isPunctuator(";") && report.addWarning("W001");

        // Good
        if (token.isPunctuator(";"))
          report.addWarning("W001");

Today we use JSHint's `white:true` to enforce some of these rules. Eventually
we'll switch to JSHint Next style enforcing component. But it's not ready yet.

### License

Most files are under this license:

    Copyright 2013 Anton Kovalyov (http://jshint.com)

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

One file, however, is under a slightly modified version of the license. Unfortunately,
due to historical reasons and Crockford's stubborness we can't change it. Here's this
modified license:

    JSHint, by JSHint Community.

    This file (and this file only) is licensed under the same slightly modified
    MIT license that JSLint is. It stops evil-doers everywhere:

    Copyright (c) 2002 Douglas Crockford  (www.JSLint.com)

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom
    the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included
    in all copies or substantial portions of the Software.

    The Software shall be used for Good, not Evil.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.
