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

function el(id) {
  return document.getElementById(id)
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
        console.log(cm.getLine(line).length)
        cm.setSelection({ line: line, ch: 0 }, { line: line, ch: Infinity })
      })

      row.addEventListener("mouseout", function () {
        cm.setCursor({ line: err.line - 1, ch: 0 })
      })
    }))
  })  
}