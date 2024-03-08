const { getMeta, createEvent, resetMeta } = require('@posthog/plugin-scaffold/test/utils')
const { onEvent } = require('../index')
const config = {
  publicKey: 'ENGAGE_PUBLIC_KEY',
  secret: 'ENGAGE_SEECRET',
  filter: 'Send events for all users'
}

global.fetch = jest.fn(async (url) => ({
  json: {},
  status: 200
}))

beforeEach(() => {
  fetch.mockClear()
  resetMeta({
    config,
    global
  })
})

test('onEvent to send the correct data for $identify event (user)', async () => {
  resetMeta({
    config
  })
  const auth = 'Basic ' + Buffer.from(`${config.publicKey}:${config.secret}`).toString('base64')

  const event = {
    event: '$identify',
    distinct_id: 'user01',
    properties: {
      $set: {
        first_name: 'User',
        plan: 'Pro'
      },
      $set_once: {
        last_name: '01'
      },
      token: '[some token]',
      distinct_id: '[distinct_id]'
    }
  }
  expect(fetch).toHaveBeenCalledTimes(0)
  await onEvent(event, getMeta())
  expect(fetch).toHaveBeenCalledTimes(1)
  expect(fetch).toHaveBeenCalledWith('https://api.engage.so/v1/users/user01', {
    method: 'PUT',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      first_name: 'User',
      last_name: '01',
      meta: {
        plan: 'Pro'
      },
      source: 'PostHog'
    })
  })
})

test('onEvent to send the correct data for $identify event (group)', async () => {
  resetMeta({
    config
  })
  const auth = 'Basic ' + Buffer.from(`${config.publicKey}:${config.secret}`).toString('base64')

  const event = {
    event: '$groupidentify',
    distinct_id: 'user01',
    properties: {
      $group_type: 'company',
      $group_key: 'group123',
      $group_set: {
        name: 'Group'
      }
    }
  }
  expect(fetch).toHaveBeenCalledTimes(0)
  await onEvent(event, getMeta())
  expect(fetch).toHaveBeenCalledTimes(1)
  expect(fetch).toHaveBeenCalledWith('https://api.engage.so/v1/users/group123', {
    method: 'PUT',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      is_account: true,
      first_name: 'Group',
      source: 'PostHog'
    })
  })
})

test('onEvent to send the correct data to track user event', async () => {
  resetMeta({
    config
  })
  const auth = 'Basic ' + Buffer.from(`${config.publicKey}:${config.secret}`).toString('base64')

  const event = {
    event: 'newEvent',
    distinct_id: 'user01',
    properties: {
      $set: {
        number: '08012345678',
        currency: 'NG'
      },
      prop1: 'val1',
      prop2: 'val2'
    }
  }
  expect(fetch).toHaveBeenCalledTimes(0)
  await onEvent(event, getMeta())
  expect(fetch).toHaveBeenCalledTimes(2)
  expect(fetch).toHaveBeenCalledWith('https://api.engage.so/v1/users/user01', {
    method: 'PUT',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      number: '08012345678',
      meta: {
        currency: 'NG'
      },
      source: 'PostHog'
    })
  })
  expect(fetch).toHaveBeenCalledWith('https://api.engage.so/v1/users/user01/events', {
    method: 'POST',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        prop1: 'val1',
        prop2: 'val2'
      },
      source: 'PostHog',
      event: 'newEvent'
    })
  })
})

test('onEvent to send the correct data to track group event', async () => {
  resetMeta({
    config
  })
  const auth = 'Basic ' + Buffer.from(`${config.publicKey}:${config.secret}`).toString('base64')

  const event = {
    event: 'Played movie',
    distinct_id: 'user01',
    properties: {
      $groups: {
        company: 'group123'
      },
      prop1: 'val1',
      prop2: 'val2'
    }
  }
  expect(fetch).toHaveBeenCalledTimes(0)
  await onEvent(event, getMeta())
  expect(fetch).toHaveBeenCalledTimes(1)
  expect(fetch).toHaveBeenCalledWith('https://api.engage.so/v1/users/group123/events', {
    method: 'POST',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        prop1: 'val1',
        prop2: 'val2'
      },
      source: 'PostHog',
      event: 'Played movie'
    })
  })
})
