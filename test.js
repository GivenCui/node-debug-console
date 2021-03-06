const {
    print,
    println,
    setPrintConfig
} = require('./index.js') 

print('bar1')
// 设置一行显示时的宽度
setPrintConfig({ contentLength: 50 })
print('foo2')

println('bar2')
// 设置参考路径
setPrintConfig({ context: './img' })
println('foo1')

// 复写全局的 console.log
console.log = print.bind(null)

console.log(123)