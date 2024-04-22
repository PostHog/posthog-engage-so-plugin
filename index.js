function composeWebhook (_event, { config }) {
  const event = _event.event
  if (event.startsWith('$')) {
    if (!['$identify', '$groupidentify'].includes(event)) {
      // only process custom events, $groupidentify and $identify
      return null
    }
  }
  // Ignore plugin events
  if (event.startsWith('plugin')) {
    return null
  }

  const auth = 'Basic ' + Buffer.from(`${config.publicKey}:${config.secret}`).toString('base64')
  delete config.publicKey
  delete config.secret
  _event.config = config

  return {
    url: 'https://api.engage.so/posthog',
    body: JSON.stringify(_event),
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth
    },
    method: 'POST'
  }
}

module.exports = {
  composeWebhook
}
