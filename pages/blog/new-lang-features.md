{
  "template": "blog",
  "blog": true,
  "title": "A Formal Commitment to New Language Features",
  "author": "The JSHint team",
  "date": "2015-07-07",
  "url": "/blog/new-lang-features"
}

In recent months, JSHint has been receiving requests to support [proposed
JavaScript language features](https://github.com/tc39/ecma262) like
[`async`/`await`](https://github.com/tc39/ecmascript-asyncawait), [method
decorators](https://github.com/wycats/javascript-decorators), and [class
property declarations](https://gist.github.com/jeffmo/054df782c05639da2adb)
[[1](#ref-1)]. The JSHint team has turned down each request, even after the
release of [ES2015](http://www.ecma-international.org/ecma-262/6.0/). This has
not been easy; as open source project maintainers, nothing gives us more
pleasure than to write code in benefit of our users. We've tried to explain our
motivations in an ad-hoc way, but it's always come off as a bit haphazard. We'd
like to take some time to more thoroughly describe our thought process.

The long and short of it is: JSHint will require all language extension
proposals to be at "Stage 2" of [TC-39's standardization
process](https://docs.google.com/document/d/1QbEE0BsO4lvl7NFTn5WXWeiEIBfaVUF7Dk0hpPpPDzU/edit?pli=1)
before parsing and linting them.

## Why so defensive?

Projects like [Traceur](https://github.com/google/traceur-compiler) and
[Babel](http://babeljs.io/) have become very popular through progressive
implementation of the latest features and proposals. It's fair to question why
JSHint should be any different.

First off, **it's difficult for the project maintainers**. This is not really a
defensible motivation; we only offer it in the interest of full disclosure.
Over the years, JSHint has grown from [JSLint](http://jslint.com/) thanks to
the efforts of hundreds of contributors.  This has been key to its success, but
it has also contributed to a fair amount of technical debt. Extending the
parser requires a fair amount of study, and even then, it isn't always clear
how to do this cleanly.

The project has tried to be progressive about new syntax in the past
[[2](#ref-2)], and this has often contributed to technical debt. For instance,
JSHint continues to
([grudgingly](https://github.com/jshint/jshint/pull/2519#issuecomment-118409190))
maintain [a `moz` option for Mozilla-specific
extensions](https://github.com/jshint/jshint/blob/e32e17b97289e4bb5a53116ffc3a979356792088/src/options.js#L466-L476),
and the current `esnext` option includes non-standard array comprehensions. (By
the way: now that ES2015 is released, that name describes a non-existent
specification draft.)

[A plugin system](https://github.com/jshint/jshint/issues/2079) is one possible
way to address this, but that will require a large effort involving careful
design, spanning refactoring, and a long-term commitment to implementation
details.

More importantly, **it's hazardous for developers**. Inconsistencies within
toolchains will gate developers on the lowest common denominator. Imagine the
day that your transpiler supports draft 17 but JSHint has moved to draft 18.
Even if you're not struggling with coordination issues between parsers, the
release cycle for a "progressive" parser would leave most application
developers behind. Projects would frequently rely on outdated release channels
that no longer received bug fixes or new features.

[JSHint was born out of a reluctance to make decisions on behalf of the
user](https://medium.com/@valueof/why-i-forked-jslint-to-jshint-73a72fd3612),
so while we think the above considerations should be made clear to JSHint's
users, we haven't made this decision based on them.

We also believe **it's harmful for the ecosystem**. Empowering developers to
write non-standard code can have long-term effects on the open source
ecosystem. Code has a tendency to live longer than we expect, but it isn't
always maintained throughout its lifetime. We all look forward to the day that
features like method decorators are standard and widely-supported. Prior to
that, it's important to remember that the code we write with experimental
language features is itself non-standard. It will be frustrating if, in 2
years, you are reviewing older code that seems to use "standard" function
decorators but that in reality depends on the syntax and semantics of "revision
12" of the function decorator proposal. The differences may be subtle, and you
will be forced to research the behavior of this not-quite-JavaScript before you
can contribute to the project.

Finally, **it's unhealthy for the language**. TC39 does not operate from an
ivory tower. They recognize practical considerations of patterns in existing
code.  Look no further than [Annex
B](http://www.ecma-international.org/ecma-262/6.0/#sec-additional-ecmascript-features-for-web-browsers)
for proof of that. Sometimes, that is a good thing. [The Promises/A+
spec](https://promisesaplus.com/) offered a clear way forward when Promises
were first considered for inclusion in ES2015. Sometimes, this is a bad thing.
It's the reason why we expect
[`Array.prototype.includes`](https://github.com/tc39/Array.prototype.includes/)
instead of
[`Array.prototype.contains`](https://esdiscuss.org/topic/having-a-non-enumerable-array-prototype-contains-may-not-be-web-compatible).
The proliferation of production code can have [a solidifying
effect](https://medium.com/@morrissinger/the-rise-of-the-bully-pulpit-in-the-evolution-of-javascript-94fb394d3b69)
on new features. To the extent that JSHint is a channel through which new
JavaScript flows (a minuscule one to be sure), we want to cooperate with the
design process.

## So why stage 2?

Stage 2 seems specifically designed for our position in the ecosystem.

It's not too early. Features in this stage have a formal definition (so we have
a consistent and complete set of instructions to build from). These features
are also relatively stable, so JSHint has a chance to keep up with the latest
draft modifications.

It's also not too late. The design process can still benefit from the
experience of developers applying a given pattern to their code. The process
document defines "incremental" changes expected for Stage 2 proposals, and only
recommends "experimental" implementations. You might say, "[these features seem
stable enough](https://bugzilla.mozilla.org/show_bug.cgi?id=258974#c22)", but
the truth is, JSHint was dealing with non-trivial modifications to ES2015 from
the moment we implemented them until as late as May of this year [[3](#ref-3)].
So it's worth noting that JSHint is *still* taking some risk here.

We think there's tremendous value in experimentation at earlier stages in the
process. We also feel that research should be conducted in non-production
settings in order to avoid the more fundamental problems discussed above.
Early-stage experiments have less to gain from automated code analysis both
because of their limited scope and because their syntax is already verified by
a "transpiler". In these contexts, linting has much more limited relevance.

##  Moving forward

Here's the practical effect of all that talk:

- JSHint 3 will not expose an `esnext` option; it will instead support
  `esversion: 6`.
- JSHint will continue to support the `moz` option, and it will be the only
  setting that enables array comprehension parsing.
- JSHint will *not* expose an `esversion: 7` option until that specification is
  finalized by ECMA.
- JSHint will support for stage-2-and-above proposals under the `experimental`
  configuration namespace. These features will be clearly documented as subject
  to breaking changes between major releases.

This policy means denying first-class support for non-standard and early
proposal features. JSHint will continue to support `ignore` directives as a
coarse-grained mechanism for operating on non-standard and early-proposal
features, but we know [other linting tools go much farther than
that](https://github.com/babel/babel-eslint). We're motivated by our
responsibility to developers but also to the open source ecosystem and to the
standards process itself. We hope JSHint's usership continues to enjoy the tool
because they share these same values.

---

<span id="ref-1">
[1] Requests for proposed language features:

- [gh-1977 WIP: Async/await](https://github.com/jshint/jshint/pull/1977)
- [gh-1979 Added optional asyncawait support on top of
  esnext](https://github.com/jshint/jshint/pull/1979)
- [gh-2077 AsyncAwait plugin](https://github.com/jshint/jshint/pull/2077)
- [gh-2297 Please add support for ES7 method
  decorators](https://github.com/jshint/jshint/issues/2297)
- [gh-2304 ES7 Class Properties throws 'Unexpected token
  ='](https://github.com/jshint/jshint/issues/2304)
- [gh-2309 class property initializers
  proposal](https://github.com/jshint/jshint/issues/2309)
- [gh-2310 Support for ES7
  decorators?](https://github.com/jshint/jshint/issues/2310)
- [gh-2504 ES7: async and await](https://github.com/jshint/jshint/issues/2504)

</span>

<span id="ref-2">
[2] Introduction of ES6 features

- [gh-971 Arrow functions](https://github.com/jshint/jshint/pull/971) (13.03.28)
- [gh-1048 ES6 classes](https://github.com/jshint/jshint/pull/1048) (13.05.19)
- [gh-1608 Support ModuleImport
  expressions](https://github.com/jshint/jshint/pull/1608) (14.04.05)
- [gh-1563 Add basic support for ES6
  TemplateLiterals](https://github.com/jshint/jshint/pull/1563) (14.03.21)

</span>

<span id="ref-3">
[3] Issues involving changes to the spec:

- [gh-1123 A generator function shall contain a yield
  statement.](https://github.com/jshint/jshint/issues/1123)
- [gh-1936 ES6 (`esnext`) error: `import * as foo from
  'bar'](https://github.com/jshint/jshint/issues/1936)
- [gh-2019 ES6 classes with export default flagged as 'not
  defined'](https://github.com/jshint/jshint/issues/2019)
- [gh-2144 Support more cases of ES6 module
  usage](https://github.com/jshint/jshint/pull/2144)
- [gh-2197 ES6 (esnext:true), jshint says "Foo is not defined"... but it's
  defined!](https://github.com/jshint/jshint/issues/2197)
- [gh-2395 jshint incorrectly supports the module x from 'y'
  format?](https://github.com/jshint/jshint/issues/2395)

</span>
