const path = require('path')
// black console
const getZhLength = (str) => str.match(/\p{Unified_Ideograph}/gu) || ''
const getStyle = (name, text) => {
    let objColors = {
        green: [32, 39],
        magenta: [35, 39],
        gray: [90, 39]
    },
        color = objColors[name]
    return `\u001B[${color[0]}m${text}\u001B[${color[1]}m`
}
const getText = (config) => {
    let err = new Error(),
        strErr = err.stack,
        strLineErr = strErr.split(/\r|\n/)[3],
        arrErrResult = strLineErr.match(/[^/|:|\\]{1,}/ig),
        temp = {}

    temp.colNum = +arrErrResult.pop()
    temp.lineNum = +arrErrResult.pop()
    temp.fileName = '/' + arrErrResult.slice(1).join('/')
    temp.fileName = path.relative(config.context, temp.fileName)
    if (/^[^\.\/]/.test(temp.fileName)) {
        temp.fileName = './' + temp.fileName
    }
    return /\\|\//ig.test(strLineErr) ? `💡 ${getStyle('magenta', temp.fileName)}${getStyle('gray', ':')}${getStyle('green', temp.lineNum)}` : undefined
}

const _console = console.log

let printConfig = {
    context: process.cwd(),
    contentLength: 100
}
let prefix = getStyle('gray', '... ')
const print = (...args) => {
    // 有对象的情况下, 同一行输出没法精确包装提示信息右对齐
    let content = args.map(arg => {
        try {
            return JSON.stringify(arg)
        } catch (error) {
            return arg
        }
    }).join('  ')
    let tips = getText(printConfig)

    let fixLength = printConfig.contentLength - getZhLength(content).length
    let gap = getStyle('gray', content.padEnd(fixLength, '  .').slice(content.length))
    _console(prefix, ...args, gap, tips)
}
const println = (...args) => {
    _console(getText(printConfig))
    _console(prefix, ...args, '\n')
}
const setPrintConfig = (config) => {
    printConfig = Object.assign(printConfig, config)
}

module.exports = {
    print,
    println,
    setPrintConfig,
}
