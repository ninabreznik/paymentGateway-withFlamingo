const nwcjs = require('nwcjs')

module.exports = {
  connectToFlamingo,
  payForm,
}

async function connectToFlamingo () {
  const el = document.createElement('div') 
  const shadow = el.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
    <div>
      <h1>Connect to Flamingo Wallet</h1> 
      <div>
        <h2>Paste Flamingo WebServer URI</h2>
        <input id="wss"/>
      </div>  
    </div>
    <br>
    <br>
    <br>
    <br>
  `
  const input = shadow.querySelector('input#wss')
  input.oninput = (e) => {
    const wsUri = e.target.value
    const websocket = new WebSocket(wsUri)
    websocket.onopen = async () => {
      console.log('socket opened')
      const msg = {
        type: 'message',
        text: 'hello there'
      }
      websocket.send(JSON.stringify(msg));
    }
    websocket.onmessage = (e) => {
      console.log('onmessage')
      const msg = JSON.parse(e.data)
      console.log('new message', msg)
    }
    websocket.onerror = (err) => {
      console.log({err})
    }
    websocket.onclose = (err) => {
      console.log('socket closed')
    }
  }
  return el
}

async function payForm () {
  const el = document.createElement('div') 
  const shadow = el.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
    <div>
      <h1>Nostr Wallet Connect forms</h1> 
      <div>
        <h2>Enter your Nostr Wallet connect string</h2>
        <input id="nwc"/>
      </div>  
      <div>
        <h2>Create invoice (enter the amount)</h2>
        <input id="invoice_amount" type="number" min="1"/>
      </div>  
      <div>
        <h2>Request zap invoice(enter address & amount)</h2>
        <p><input id="address"/></p>
        <p><input id="zap_amount" type="number" min="1"/></p>
      </div>  
      <div>
        <h2>Pay invoice (enter the invoice string)</h2>
        <input id="invoice_string"/>
      </div>
      <div>
        <h2>Click to submit the form</h2>
       <input id="submit" type="submit" value="Submit" />
      </div>
    </div>
  `
  const payBtn = shadow.querySelector('input#submit')
  var nwc_info
  payBtn.onclick = async () => {
    const nwc = shadow.querySelector('input#nwc').value
    const invoice_amount = Number(shadow.querySelector('input#invoice_amount').value)
    const address = shadow.querySelector('input#address').value
    const zap_amount = Number(shadow.querySelector('input#zap_amount').value)
    const invoice_string = shadow.querySelector('input#invoice_string').value
    if (nwc) {
      nwc_info = nwcjs.processNWCstring(nwc)
    }
    if (invoice_amount) {
      var invoice = await makeInvoice(invoice_amount, nwc_info)
      showInvoiceData(invoice)
    }
    if (address && zap_amount) {
      const res = await getZapRequest(address, zap_amount)
    }
    if (invoice_string) {
      const res = await payInvoice(invoice_string, nwc_info)
    }
    // const payResponse = await window.provider.sendPayment(invoice)
    // if (validatePreimage(payResponse.preimage)) console.log('yay, payment successful') 
  }
  return el
}

async function makeInvoice (amount, nwc_info) {  
  const amt = amount
  const desc = 'QuestApp invoice'
  const invoice = await nwcjs.makeInvoice(nwc_info, amt, desc)
  return invoice
}

async function showInvoiceData (invoice) {
  console.log({invoice})
  // show invoice hash & QR code to scan
  // add auto pay option
  
  // const { promise, resolve, reject } = Promise.withResolvers()
  // const el = document.createElement('div') 
  // const shadow = el.attachShadow({ mode: 'closed' })
  // shadow.innerHTML = `
  //   <div>
  //     Confirm payment of ${amount} sats
  //     <input id="reject" type="submit" value="Reject" />
  //     <input id="confirm" type="submit" value="Confirm" />
  //   </div>
  // `

  // document.body.append(el)

  // const rejectBtn = shadow.querySelector('input#reject')
  // rejectBtn.onclick = async (e) => { 
  //   el.remove()
  //   resolve(false)
  // }
  // const confirmBtn = shadow.querySelector('input#confirm')
  // confirmBtn.onclick = async (e) => { 
  //   el.remove()
  //   resolve(true)
  // }

  // return promise

}

async function payInvoice (invoice_string, nwc_info) {
  const amount = 3
  const res = await nwcjs.tryToPayInvoice(nwc_info, invoice_string, amount)
  return res
}

async function getZapRequest (address, amount) {
  const res = await nwcjs.getZapRequest(address, amount)
  console.log({res})
  return res
}