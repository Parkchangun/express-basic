// @ts-check

const fs = require("fs")

const result = fs.readFileSync('src/test')

const buf = Buffer.from([97, 98, 99, 100, 99])

console.log(buf.compare(result))
console.log("🚀 ~ file: buffer.js:8 ~ buf", buf)
console.log("🚀 ~ file: buffer.js:6 ~ result", result)
