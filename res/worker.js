importScripts("/res/jshint.js")

self.onmessage = function (ev) {
  var ret, req = ev.data

  if (req.task === "lint") {
    JSHINT(req.code, { undef: true, unused: true })

    ret = JSHINT.data()
    ret.options = null

    self.postMessage({ task: "lint", result: ret })
  }
}