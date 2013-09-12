var OK_TEXT = "Seems like JSHint hasn't found any problems with your code."

function el(q) { return document.querySelector(q) }
function on(q, ev, cb) { el(q).addEventListener(ev, cb, false) }
function show(q) { el(q).style.display = "block" }
function hide(q) { el(q).style.display = "none" }

function main() {
  var value = el("#text-intro").innerHTML

  value = value.split("\n")
  value = value.slice(1, value.length - 1)
  value = value.map(function (line) {
    return line.slice(6)
  }).join("\n")

  var config = {
    value:          value,
    mode:           "javascript",
    tabSize:        2,
    indentUnit:     2,
    lineNumbers:    true,
    indentWithTabs: false
  }

  var editor  = CodeMirror(document.body, config)
  var timeout = null

  editor.on("change", function (cm, change) {
    if (timeout)
      clearTimeout(timeout)

    timeout = setTimeout(function () {
      lint(cm, change, worker)
      timeout = null
    }, 200)
  })

  on("#showConfigure", "click", function () {
    hide("#examples")
    show("#configure")
  })

  on("#showExamples", "click", function () {
    hide("#configure")
    show("#examples")
  })

  on("#configure button.back", "click", function () {
    hide("#configure")
  })

  on("#examples button.back", "click", function () {
    hide("#examples")
  })

  on("#configure", "click", function (ev) {
    var button = ev.target

    if (button.nodeName !== "BUTTON" || !/items/.test(button.parentNode.className))
      return

    if (/active/.test(button.className))
      button.className = ""
    else
      button.className = "active"
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

  var table = el("#errors")
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