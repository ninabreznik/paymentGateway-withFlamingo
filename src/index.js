const nwcjs = require('nwcjs')

module.exports = {
  payForm,
}

async function payForm () {
  const el = document.createElement('div') 
  const shadow = el.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
    <div>
      <h1>Payment</h1> 
      <div>
        <h2>Enter your Nostr Wallet connect string</h2>
        <input id="nwc"/>
        <h2>Send payment</h2>
        <input id="amount" type="number" min="1"/>
      </div>
      <div>
        <h2>Click to create the invoice</h2>
      <input id="pay" type="submit" value="Create invoice" />
      </div>
    </div>
  `
  const payBtn = shadow.querySelector('input#pay')
  payBtn.onclick = async () => {
    const nwc = shadow.querySelector('input#nwc').value
    const amount = Number(shadow.querySelector('input#amount').value)
    const invoice = await makeInvoice(amount, nwc)
    showInvoiceData(invoice)
    // const payResponse = await window.provider.sendPayment(invoice)
    // if (validatePreimage(payResponse.preimage)) console.log('yay, payment successful') 
  }
  return el
}

async function makeInvoice (amount, NWC) {  
  console.log({NWC})
  const nwc_info = nwcjs.processNWCstring(NWC)
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