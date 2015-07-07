{
  "template": "docs",
  "blog": true,
  "title": "What's new in JSHint (December, 2013)",
  "author": "Anton Kovalyov",
  "date": "2013-12-27",
  "url": "/blog/new-in-jshint-dec-2013"
}

# What's new in JSHint (December, 2013)

Our latest release, [2.4.0](https://github.com/jshint/jshint/releases/tag/2.4.0),
was mostly a bug fix release. We fixed a lot of parsing bugs. Among them were
quite a few serious ES6-related bugs which were blocking some people and
companies from using JSHint on their ES6 codebases. Since ES6 is still in-progress,
a moving target, there might be some minor inconsistencies but overall,
if you're using more-or-less stable parts of ES6, you can use JSHint to lint
your forward-thinking code.

We also fixed a couple of bugs that were resulting in JSHint crashing
when trying to parse invalid code. If your code is syntactically
broken beyond all hope JSHint might generate false-positive warnings
and then give up but it should never crash.

### Features

Thanks to [@BenoitZugmeyer](https://github.com/BenoitZugmeyer) we added
a new flag to the JSHint CLI program, **--extract**, that allows JSHint
to lint JavaScript within HTML files.

    tmp ☭ cat test.html
    <html>
      <head>
        <title>Hello, World!</title>
        <script>
          function hello() {
            return "Hello, World!";
          }
        </script>
      </head>
      <body>
        <h1>Hello, World!</h1>
        <script>
          console.log(hello())
        </script>
      </body>
    </html>

    tmp ☭ jshint --extract=auto test.html
    test.html: line 13, col 27, Missing semicolon.

    1 error

Another new flag is **--exclude-path** which allows you to provide your
own *.jshintignore* file. Or you can point it to the *.gitignore* file and
kill two birds with one stone: exclude files both from your version control
system and JSHint.

As always, the detailed list of changes is on GitHub: [JSHint 2.4.0 is released](https://github.com/jshint/jshint/releases/tag/2.4.0).

### JSHint 3

Our next major release is shaping up nicely. I removed a lot of old code,
split *jshint.js* into smaller pieces and changed its API. New API doesn't
mutate any global object, it simply takes your arguments and returns the
resulting object:

    var jshint = require("jshint");
    var report = jshint.run(source, options, globals);

    report.data.errors.forEach(function (err) {
      console.log(err.line, err.message);
    });

Almost all bug fixes and new features from 2.4.0 were backported into the
3.x tree so the codebase is pretty well synced at this point.

### Ramblings

On the development side, I'm spending a lot of time trying to reduce the
internal state of JSHint. This means a lot of decoupling, rewriting and
re-architecting but the codebase is already looking much better.

I still haven't decided if I want to make JSHint's internal parser
to generate an AST or if I want to take a shortcut and use Acorn to do
the work for me. (This doesn't mean throwing away JSHint's
parser. We can't do that because no other parser can parse incomplete
files like JSHint and no other parser supports ES6 and Mozilla JavaScript
extensions.) Given that Acorn doesn't support ES6 syntax yet and will
probably never support Mozilla JavaScript extensions, in some cases JSHint
will not be able to return an AST. But for majority of users it should be
fine. Or, maybe, I can do Acorn as a stop-gap solution while I'm patching
JSHint to generate its own tree. Since everyone uses Mozilla Parser API
it should be easy enought to do a drop-in replacement.
