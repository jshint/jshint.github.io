{
  "template": "docs",
  "blog": true,
  "title": "New release: r10",
  "author": "Anton Kovalyov",
  "date": "2012-08-20",
  "url": "/blog/2012-08-20/release-r10"
}

# New release: r10

This release introduces lots of improvements to the `unused` option from
[r09](/blog/2012-08-05/release-r09/). For example, JSHint is now smart
enough to not to warn about unused variable if that variable is followed
by a used one:

    fetch(function (err, msg) {
          success(msg);
      });

We also fixed `JSHINT.data().unused` to be consistent with this option.

Other changes:

* You can now exclude globals. For example, if you want to assume browser
  environment but disallow the use of `event` you can do the following:

      /*jshint browser:true */
            /*global -event */

* JSHint now recognizes `(function () {})();` as well as
  `(function () {}());`.
* JSHint can now parse labeled and lonely blocks without generating
  false positives.
* \+ other bugfixes.

Thanks to Amir E. Aharoni and Carl Ekerot.
