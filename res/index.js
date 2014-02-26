var NUM_TEXTS = [
  null, "One", "Two", "Three", "Four", "Five",
  "Six", "Seven", "Eight", "Nine", "Ten"
]

function el(q) { return document.querySelector(q) }
function on(q, ev, cb) { el(q).addEventListener(ev, cb, false) }
function show(q) { el(q).style.display = "block" }
function hide(q) { el(q).style.display = "none" }
function each(o, cb) { Object.keys(o).forEach(function (k) { cb(o[k], k) }) }

function save(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj))
}

function restore(key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (err) {
    localStorage.removeItem(key)
    return null
  }
}

var editor = null
var worker = null
var cache  = { toggled: { configure: false, output: true } }

var prefs  = restore("prefs") || {
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

    var button  = ev.target
    var targets = button.getAttribute("data-target")

    targets.split(",").forEach(function (key, i) {
      var target  = el("#" + key)
      var state   = cache.toggled[key]

      cache.toggled[key] = state = !state
      target.style.display = state ? "block" : "none"
      if (!state) save("prefs", prefs)

      if (i === 0)
        button.className = state ? "active" : ""
    })
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
      tm = null
      lint()
    }, 200)
  })
}

function lint() {
  var value  = editor.getValue()
  var config = {}

  if (!worker) {
    worker = new Worker("/res/worker.js")
    worker.addEventListener("message", function (ev) { display(JSON.parse(ev.data.result)) })
  }

  each(prefs.opts, function (state, name) { config[name] = state })
  each(prefs.rev,  function (state, name) { config[name] = !state })

  worker.postMessage({ task: "lint", code: value, config: config })
}

function makeRow(line, message) {
  var row   = document.createElement("tr")
  var mcell = document.createElement("td")

  mcell.innerHTML = message

  if (line !== null) {
    var lcell = document.createElement("td")
    lcell.className = "lineno"
    lcell.innerHTML = line
    row.appendChild(lcell)

    row.addEventListener("mouseover", function () {
      editor.setSelection({ line: line - 1, ch: 0 }, { line: line - 1, ch: Infinity })
    })

    row.addEventListener("mouseout", function () {
      editor.setCursor({ line: line - 1, ch: 0 })
    })
  } else {
    mcell.className = "header"
    mcell.setAttribute("colspan", 2)
  }

  row.appendChild(mcell)
  return row
}

function display(resp) {
  showUndef(resp.implieds)
  showUnused(resp.unused)
  showErrors(resp.errors)
  showMetrics(resp.functions)
}

function showErrors(errors) {
  var table = el("[data-type=errors]")
  var text = ""

  table.innerHTML = ""

  if (!errors)
    return false

  if (errors.length === 1)
    text = "One warning"
  else if (errors.length < 11)
    text = NUM_TEXTS[errors.length] + " warnings"
  else
    text = errors.length + " warnings"

  table.appendChild(makeRow(null, text))

  errors.forEach(function (err) {
    if (err === null) return
    table.appendChild(makeRow(err.line, err.reason))
  })
}

function showUndef(undef) {
  var table = el("[data-type=undef]")
  var text = table.innerHTML = ""

  if (!prefs.meta.undef || !undef)
    return false

  if (undef.length === 1)
    text = "One undefined variable"
  else if (undef.length < 11)
    text = NUM_TEXTS[undef.length] + " undefined variables"
  else
    text = undef.length + " undefined variables"

  table.appendChild(makeRow(null, text))

  undef.forEach(function (item) {
    item.line.forEach(function (line) {
      table.appendChild(makeRow(line, item.name))
    })
  })

  return undef.length > 0
}

function showUnused(unused) {
  var table = el("[data-type=unused]")
  var text = table.innerHTML = ""

  if (!prefs.meta.unused || !unused)
    return false

  if (unused.length === 1)
    text = "One unused variable"
  else if (unused.length < 11)
    text = NUM_TEXTS[unused.length] + " unused variables"
  else
    text = unused.length + " unused variables"

  table.appendChild(makeRow(null, text))

  unused.forEach(function (item) {
    table.appendChild(makeRow(item.line, item.name))
  })

  return unused.length > 0
}

function showMetrics(functions) {
  var div  = el("[data-type=metrics]")
  var wrap = el("[data-type=metrics] > div")
  wrap.innerHTML = ""

  function p(text) {
    var el = document.createElement("p")
    el.innerHTML = text
    wrap.appendChild(el)
  }

  function calc(nums) {
    var half, len = nums.length
    nums.sort(function (a, b) { return a - b })
    half = Math.floor(len / 2)
    console.log(nums)
    return {
      max: nums[len - 1],
      med: len % 2 ? nums[half] : (nums[half - 1] + nums[half]) / 2.0
    }
  }

  if (!prefs.meta.complex || !functions.length) {
    div.style.display = "none"
    return false
  }

  div.style.display = "block"

  if (functions.length === 1) {
    p("There is only <b>one</b> function in this file.")

    switch (functions[0].metrics.parameters) {
      case 0:
        p("It takes <b>no</b> arguments.")
        break
      case 1:
        p("It takes <b>one</b> argument.")
        break
      default:
        p("It takes <b>" + functions[0].metrics.parameters + "</b> arguments.")
    }

    switch(functions[0].metrics.statements) {
      case 0:
        p("This function is <b>empty</b>.")
        break
      case 1:
        p("This function contains only <b>one</b> statement.")
        break
      default:
        p("This function contains <b>" + functions[0].metrics.statements + "</b> statements.")
    }

    p("Cyclomatic complexity number for this function is <b>"
      + functions[0].metrics.complexity + "</b>.")

    return
  }

  var func = functions.length
  var args = calc(functions.map(function (fn) { return fn.metrics.parameters }))
  var stmt = calc(functions.map(function (fn) { return fn.metrics.statements }))
  var comp = calc(functions.map(function (fn) { return fn.metrics.complexity }))

  p("There are <b>" + func + "</b> functions in this file.")
  p("Function with the largest signature take <b>" + args.max +
    "</b> arguments, while the median is <b>" + args.med + "</b>.")
  p("Largest function has <b>" + stmt.max + "</b> statements in it," +
    " while the median is <b>" + stmt.med + "</b>.")
  p("The most complex function has a cyclomatic complexity value of <b>" + comp.max +
    "</b> while the median is <b>" + comp.med + "</b>.")
}
