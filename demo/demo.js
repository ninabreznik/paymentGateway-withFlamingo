const components = require('../src/index.js')

async function start () {
  const connect = await components.connectToFlamingo() 
  const payForm = await components.payForm() 
  document.body.append(connect, payForm)
}

start()