{
  "template": "blog",
  "blog": true,
  "title": "New release: r09",
  "author": "Anton Kovalyov",
  "date": "2012-08-05",
  "url": "/blog/2012-08-05/release-r09"
}

This release introduces a new option called `unused`. This option
allows you to quickly spot variables that were defined but never used.

Other changes:

* Fixes and improvements for our new option `quotmark` from
  [r08](/blog/2012-07-26/release-r08/).
* Rhino wrapper now accepts shortcuts for predefined globals:

        $ rhino jshint-rhino.js myfile.js undef:true myglobal

    Also, it no longer assumes `rhino=true` for all files.
* We removed `JSHINT.report` (it used to generate HTML based on JSHint
  output).
* We changed `camelcase` to tolerate variables with leading underscores
  since it is one of the most common patterns for pseudo-private variables
    in JavaScript.
* `nomen` now recognizes Underscore.js global.
* \+ other minor bugfixes.

Thanks to Rod Vagg and Nikolay Frantsev.
