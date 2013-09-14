var OK_TEXT = "Seems like JSHint hasn't found any problems with your code."

function el(q) { return document.querySelector(q) }
function on(q, ev, cb) { el(q).addEventListener(ev, cb, false) }
function show(q) { el(q).style.display = "block" }
function hide(q) { el(q).style.display = "none" }
function each(o, cb) { Object.keys(o).forEach(function (k) { cb(o[k], k) }) }

var editor = null
var worker = null
var cache  = { toggled: {} }

var prefs  = {
  opts: {
    forin:    true,
    noarg:    true,
    bitwise:  true,
    nonew:    true,
    strict:   false,

    browser:  true,
    devel:    true,
    node:     false,
    jquery:   false,
    esnext:   false,
    moz:      false,
    es3:      false
  },

  rev: {
    eqnull:   true,
    debug:    true,
    boss:     true,
    evil:     true,
    loopfunc: true,
    laxbreak: true
  },

  meta: {
    unused:   true,
    undef:    true,
    complex:  true
  }
}

function pref(id, val) {
  var cat = null

  each(prefs, function (o, k) {
    if (o[id] !== undefined) cat = k
  })

  if (!cat)
    return null

  if (val !== undefined)
    prefs[cat][id] = val

  return prefs[cat][id] || null
}

function setup() {
  each(prefs, function (opts, n) {
    each(opts, function (state, id) {
      el("#" + id).className = state ? "active" : ""
    })
  })

  on("body", "click", function (ev) {
    if (ev.target.getAttribute("data-type") !== "toggle")
      return

    var button = ev.target
    var target = button.getAttribute("data-target")
    var state  = cache.toggled[target] || false

    cache.toggled[target] = state = !state
    el("#" + target).style.display = state ? "block" : "none"
  })

  on("body", "click", function (ev) {
    if (ev.target.getAttribute("data-type") !== "pref")
      return

    var button = ev.target
    var id = button.getAttribute("id")

    pref(id, !pref(id))
    button.className = pref(id) ? "active" : ""
    lint()
  })
}

function main() {
  var value = el("#text-intro").innerHTML
  value = value.split("\n")
  value = value.slice(1, value.length - 1)
  value = value.map(function (line) { return line.slice(6) }).join("\n")

  editor = CodeMirror(document.body, {
    value:          value,
    mode:           "javascript",
    tabSize:        2,
    indentUnit:     2,
    lineNumbers:    true,
    indentWithTabs: false
  })

  setup()
  lint()

  var tm = null
  editor.on("change", function (cm) {
    if (tm)
      clearTimeout(tm)

    tm = setTimeout(function () {
      lint()
      tm = null
    }, 200)
  })
}

function lint() {
  var value  = editor.getValue()
  var config = {}

  if (!worker) {
    worker = new Worker("/res/worker.js")
    worker.addEventListener("message", function (ev) { display(ev.data.result) })
  }

  each(prefs.opts, function (state, name) { config[name] = state })
  each(prefs.rev,  function (state, name) { config[name] = !state })

  worker.postMessage({ task: "lint", code: value, config: config })
}

function display(resp) {
  function makeRow(line, message, cb) {
    var row   = document.createElement("tr")
    var lcell = document.createElement("td")
    var mcell = document.createElement("td")

    lcell.className = "lineno"
    lcell.innerHTML = line
    mcell.innerHTML = message

    row.appendChild(lcell)
    row.appendChild(mcell)

    cb = cb || function () {}
    cb(row)

    return row
  }

  var table = el("#errors")
  table.innerHTML = ""

  if (resp.errors == null)
    return void table.appendChild(makeRow("&#x2713;", OK_TEXT))

  resp.errors.forEach(function (err) {
    table.appendChild(makeRow(err.line, err.reason, function (row) {
      row.addEventListener("mouseover", function () {
        var line = err.line - 1
        editor.setSelection({ line: line, ch: 0 }, { line: line, ch: Infinity })
      })

      row.addEventListener("mouseout", function () {
        editor.setCursor({ line: err.line - 1, ch: 0 })
      })
    }))
  })
}