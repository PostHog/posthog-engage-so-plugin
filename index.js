import fetch from "node-fetch";
const { Buffer } = require('buffer').Buffer;


const engageUrl = 'https://'


async function onEvent (_event, { config }) {
    if(_event.event.startWith('$')){
        if(_event.event !== '$identify'){
            // we only process custom events and $identify event
            return
        }
    }
    eventBody = JSON.stringify(_event)

    auth = 'Basic '+ Buffer.from(`${config.publicKey}:${config.secret}`).toString('base64')
  
    fetch(engageUrl, {
        method: 'post',
        body: JSON.stringify(eventBody),
        headers: {
            'Content-Type': 'application/json',
            Authorization: auth
        }
    }).then(()=> Promise.resolve())
    .catch(()=>{})
}
  // The plugin itself
module.exports = {
    onEvent
}