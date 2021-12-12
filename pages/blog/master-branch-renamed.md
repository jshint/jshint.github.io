{
  "template": "blog",
  "blog": true,
  "title": "Renaming the 'master' branch of the source code repository",
  "author": "The JSHint team",
  "date": "2021-12-11",
  "url": "/blog/renaming-the-master-branch"
}

Since [JSHint's inception](/blog/hello/), the project's source code has been
maintained using [the Git version control software](https://git-scm.com/), and
the central development branch was named "master". Today, we have renamed that
branch to "main".

This change should not effect any contributions that are currently under
review, but contributors should update their local repositories accordingly.
These commands will do the trick:

    git branch -m master main
    git fetch origin
    git branch -u origin/main main
    git remote set-head origin -a

If you have chosen a different name for your "origin" remote, then use that
name in place of the word "origin" in the commands above.

As always, please don't hesitate to contact the maintainers if you need any
assistance!
