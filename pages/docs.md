{ "title": "JSHint Documentation", "url": "/docs/", "template": "docs" }

# Documentation

JSHint helps you find dubious and invalid syntax in JavaScript files, enabling
you to quickly identify potential problems.

The project consists of a core library and also a CLI module that runs on
[Node.js](https://nodejs.org).

More docs: [Directives](#directives) · [JSHint options](/docs/options/) · 
[Command-line Interface](/docs/cli/) · [API](/docs/api/) · 
[Writing your own reporter](/docs/reporters/) · [FAQ](/docs/faq/)

### Basic usage

After [installaling JSHint](/install/) there are three main ways to use it:

* [via command-line tool](/docs/cli/) (via [Node.js](https://nodejs.org))
* [via JavaScript module](/docs/api/)
* [via editor integration](/install/#urg)

However, before putting it to use, you should set some options (see
**Configuration** section below for how), in particular:

* [ECMA Script version](/docs/options/#esversion)
* [Environment](/docs/options/#environments) (eg. Node.js, browser, jQuery, etc)

### Configuration

By default, JSHint will report all potential issues with your code. This is useful
for developers who are just starting with JavaScript, but can become irritating
for more experienced developers. Luckily, JSHint can be customised to your specific
requirements.

There are three ways to define options, listed in order of precendence:

1. **Inline** - via code comments
  * block level (eg. within a function)
  * script level
2. **Settings file**
  * `package.json` - project-level settings
  * `.jshintrc` - project-level or global settings
3. **Command line** - use the `--config` flag

Note: Some options, such as the `exported` and `ignore` directives, can only be
specified inline as they apply to a specific file or block of code.

#### Inline options

To specify options inline, simply add a comment to your script that starts with
a valid directive (most commonly, `jshint`) followed by one or more options.
Both line and block comments work:

    // jshint esversion: 6, node: true
    /* jshint esversion: 6, node: true */

If options are placed within a function, they will only apply to that function:

    function foo() {
        // jshint varstmt: true
        var bar = 'qux'; // displays warning about using vars
    }

    var meh = 'moo'; // no warning given

#### Settings file

You can use either a `.jshintrc` or a `package.json` file to specify project-wide
options.

**Example: `package.json`**

Set project-wide settings by adding a `jshintConfig` section to your `package.json`
file:

    {
        "jshintConfig": {
            "esversion": 6,
            "node": true
        }
    }

**Example: `.jshintrc`**

JSHint will look in the same folder as the file being linted, and if not found
there, it will try each parent folder in turn up to file system root. Useful if
you want to define default settings for all projects.

    {
        "undef": true,
        "unused": true,
        "predef": [ "MY_GLOBAL" ]
    }

Note: If the input comes from `stdin`, JSHint doesn't attempt to find a
configuration file (as it doesn't know where to start the search).

#### Command line

For details, see `--config` flag section in [Command Line Interface](/docs/cli/).

<a name="directives"></a>

### Directives

Here's a list of configuration directives supported by JSHint:

#### jshint

A directive for setting JSHint options.

    /* jshint strict: true */

#### jslint

A directive for setting JSHint-compatible JSLint options.

    /* jslint vars: true */

#### globals

A directive for telling JSHint about global variables that are defined
elsewhere. If value is `false` (default), JSHint will consider that variable
as read-only. Use it together with the `undef` option.

    /* globals MY_LIB: false */

You can also blacklist certain global variables to make sure they are not used
anywhere in the current file.

    /* globals -BAD_LIB */

#### exported

A directive for telling JSHint about global variables that are defined in the
current file but used elsewhere. Use it together with the `unused` option.

    /* exported EXPORTED_LIB */

#### members

A directive for telling JSHint about all properties you intend to use. **This
directive is deprecated.**

#### ignore

A directive for telling JSHint to ignore a block of code.

    // Code here will be linted with JSHint.
    /* jshint ignore:start */
    // Code here will be ignored by JSHint.
    /* jshint ignore:end */

All code in between `ignore:start` and `ignore:end` won't be passed to JSHint
so you can use any language extension such as [Facebook React](http://facebook.github.io/react/).
Additionally, you can ignore a single line with a trailing comment:

    ignoreThis(); // jshint ignore:line

### Options

Most often, when you need to tune JSHint to your own taste, all you need to do
is to find an appropriate option. Trying to figure out how JSHint options work
can be confusing and frustrating (and we're working on fixing that!) so please
read the following couple of paragraphs carefully.

JSHint has two types of options: enforcing and relaxing. The former are used to
make JSHint more strict while the latter are used to suppress some warnings.
Take the following code as an example:

    function main(a, b) {
      return a == null;
    }

This code will produce the following warning when run with default JSHint
options:

    line 2, col 14, Use '===' to compare with 'null'.

Let's say that you know what you're doing and want to disable the produced
warning but, in the same time, you're curious whether you have any variables
that were defined but never used. What you need to do, in this case, is to
enable two options: one relaxing that will suppress the `=== null` warning and
one enforcing that will enable checks for unused variables. In your case these
options are `unused` and `eqnull`.

    /*jshint unused:true, eqnull:true */
    function main(a, b) {
      return a == null;
    }

After that, JSHint will produce the following warning while linting this example
code:

    demo.js: line 2, col 14, 'main' is defined but never used.
    demo.js: line 2, col 19, 'b' is defined but never used.

Sometimes JSHint doesn't have an appropriate option that disables some
particular warning. In this case you can use `jshint` directive to disable
warnings by their code. Let's say that you have a file that was created by
combining multiple different files into one:

    "use strict";
    /* ... */

    // From another file
    function b() {
      "use strict";
      /* ... */
    }

This code will trigger a warning about an unnecessary directive in function `b`.
JSHint sees that there's already a global "use strict" directive and informs you
that all other directives are redundant. But you don't want to strip out these
directives since the file was auto-generated. The solution is to run JSHint
with a flag `--verbose` and note the warning code (W034 in this case):

    $ jshint --verbose myfile.js
    myfile.js: line 6, col 3, Unnecessary directive "use strict". (W034)

Then, to hide this warning, just add the following snippet to your file:

    /* jshint -W034 */

A couple things to note:

1. This syntax works only with warnings (code starts with `W`), it doesn't work
with errors (code starts with `E`).
2. This syntax will disable all warnings with this code. Some warnings are more
generic than others so be cautious.

To re-enable a warning that has been disabled with the above snippet you can
use:

    /* jshint +W034 */

This is especially useful when you have code which causes a warning but that
you know is safe in the context. In these cases you can disable the warning as
above and then re-enable the warning afterwards:

    var y = Object.create(null);
    // ...
    /*jshint -W089 */
    for (var prop in y) {
        // ...
    }
    /*jshint +W089 */

See [Options](/docs/options/) for a list of all options supported by JSHint.

#### Switch statements

By default JSHint warns when you omit `break` or `return` statements within
switch statements:

    switch (cond) {
    case "one":
      doSomething(); // JSHint will warn about missing 'break' here.
    case "two":
      doSomethingElse();
    }

If you really know what you're doing you can tell JSHint that you intended the
case block to fall through by adding a `/* falls through */` comment:

    switch (cond) {
    case "one":
      doSomething();
      /* falls through */
    case "two":
      doSomethingElse();
    }
