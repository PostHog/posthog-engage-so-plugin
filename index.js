import fetch from "node-fetch";

const engageUrl = 'https://us-central1-engage-dev-300709.cloudfunctions.net/posthog-integration'


async function onEvent (_event, { config }) {
    if(_event.event.startsWith('$')){
        if(_event.event !== '$identify'){
            // we only process custom events and $identify event
            return
        }
    }
    eventBody = JSON.stringify(_event)

    auth = 'Basic '+ Buffer.from(`${config.publicKey}:${config.secret}`).toString('base64')
  
    fetch(engageUrl, {
        method: 'post',
        body: eventBody,
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