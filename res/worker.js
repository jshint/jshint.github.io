importScripts("/res/jshint/dist/jshint.js")

self.onmessage = function (ev) {
  var ret, req = ev.data

  if (req.task === "lint") {
    JSHINT(req.code, req.config)

    ret = JSHINT.data()
    ret.options = null
    self.postMessage({ task: "lint", result: JSON.stringify(ret) })
  }
}