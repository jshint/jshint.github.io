var editor;

function main() {
  editor = CodeMirror(document.getElementById("editor"), {
    value: "// Your code here.",
    mode: "javascript",
    indentUnit: 2,
    tabSize: 2,
    lineNumbers: true,
    indentWithTabs: false,
    styleActiveLine: true
  })
}