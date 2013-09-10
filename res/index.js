var OK_TEXT = "Seems like JSHint hasn't found any problems with your code."
var CM_TEXT = [
  "// Hello.",
  "//",
  "// This is JSHint, a tool that helps to detect errors and potential",
  "// problems in your JavaScript code.",
  "//",
  "// To start, simply enter some JavaScript anywhere on this page.",
  "// Additionally, you can toggle specific options in the Configure menu",
  "// above or, if you're not sure what JSHint can do for you, look through",
  "// the examples.",
  "",
  "function main() {",
  "  return 'Hello, World!';",
  "}",
  "",
  "main();"
]

var CM_CONFIG = {
  value:          CM_TEXT.join("\n"),
  mode:           "javascript",
  tabSize:        2,
  indentUnit:     2,
  lineNumbers:    true,
  indentWithTabs: false
}

var CONFIGURE = {
  Warn: {
    debug:    "About debugging code", //
    forin:    "About unsafe for..in",
    eqnull:   "About == null", //
    noarg:    "About arguments.caller and .callee",
    noempty:  "About empty blocks",
    eqeqeq:   "About unsafe comparisons",
    boss:     "About assignments inside if/for/...", //
    loopfunc: "About functions inside loops", //
    evil:     "About eval", //
    laxbreak: "About unsafe line breaks", //
    bitwise:  "When bitwise operators are used",
    strict:   "When code is not in strict mode",
    undef:    "When variable is not defined",
    unused:   "When variable is defined but not used",
    curly:    "When block omits {}",
    nonew:    "When new is used for side-effects" //
  },

  Assume: {
    browser:  "Browser",
    devel:    "Development (console, etc.)",
    jquery:   "jQuery",
    esnext:   "New JavaScript features (ES6)",
    moz:      "Mozilla JavaScript extensions",
    es3:      "Older environments (ES3)",
    node:     "NodeJS"
  }
}

function el(id) {
  return document.getElementById(id)
}

function createPanels() {
  var panel = document.createElement("div")
  panel.id = "configure"
  panel.className = "win row"

  var back = document.createElement("button")
  back.innerHTML = "&larr; Done"
  back.className = "back"
  back.addEventListener("click", toggleConfigure, false)
  panel.appendChild(back)

  Object.keys(CONFIGURE).forEach(function (title) {
    var col = document.createElement("div")
    var h4  = document.createElement("h4")

    col.className = "col-md-3 items"
    h4.innerHTML = title
    col.appendChild(h4)

    Object.keys(CONFIGURE[title]).forEach(function (option) {
      var button = document.createElement("button")
      button.name = option
      button.innerHTML = CONFIGURE[title][option]
      button.addEventListener("click", function () {
        button.className = (button.className === "active" ? "" : "active")
      }, false)
      col.appendChild(button)
    })

    panel.appendChild(col)
  })

  document.body.appendChild(panel)
}

function main() {
  var editor  = CodeMirror(document.body, CM_CONFIG)
  var timeout = null

  editor.on("change", function (cm, change) {
    if (timeout)
      clearTimeout(timeout)

    timeout = setTimeout(function () {
      lint(cm, change, worker)
      timeout = null
    }, 200)
  })

  var worker = new Worker("/res/worker.js")
  worker.addEventListener("message", function (ev) { display(editor, ev.data.result) })
  worker.postMessage({})  

  lint(editor, null, worker)
  createPanels()
  el("showConfigure").addEventListener("click", toggleConfigure, false)
}

function lint(cm, change, worker) {
  worker.postMessage({ task: "lint", code: cm.getValue() })
}

function display(cm, resp) {
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

  var table = el("errors")
  table.innerHTML = ""

  if (resp.errors == null)
    return void table.appendChild(makeRow("&#x2713;", OK_TEXT))

  resp.errors.forEach(function (err) {
    table.appendChild(makeRow(err.line, err.reason, function (row) {
      row.addEventListener("mouseover", function () {
        var line = err.line - 1;
        cm.setSelection({ line: line, ch: 0 }, { line: line, ch: Infinity })
      })

      row.addEventListener("mouseout", function () {
        cm.setCursor({ line: err.line - 1, ch: 0 })
      })
    }))
  })  
}

function toggleConfigure() {
  var panel = document.getElementById("configure")
  panel.style.display = panel.style.display !== "none" ? "none" : "block"
}