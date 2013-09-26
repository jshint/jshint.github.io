{
  "template": "docs",
  "blog": true,
  "title": "Better integration with NPM",
  "date": "2013-08-02",
  "url": "/blog/better-npm-integration",
  "altUrl": "/blog/2013-08-02/npm"
}

# Better integration with NPM

If you're working on an NPM package you don't need to have a *.jshintrc*
file anymore. Just put your JSHint options into your *package.json* file
as a property named `jshintConfig` and you're all set! The format
is exactly the same as *.jshintrc*.

Example: [*package.json* for JSHint itself](https://github.com/jshint/jshint/blob/master/package.json#L51).