const components = require('../src/index.js')

async function start () {
  const payForm = await components.payForm() 
  document.body.append(payForm)
}

start()