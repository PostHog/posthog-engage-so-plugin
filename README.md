# POSTHOG ENGAGE APP

This app processes and sends your posthog events to [engage.so](https://engage.so).
Once installed it sends your custom events to engage using your config variables

## Tracked Events

The app only tracks your **Customer Events** and your **$identify** events

### Setup
During installation, you will provide your engage secret key and public key
This would be used to send your posthog events to Engage

Go to Engage dashboard (Settings -> Account) to get this information

Once setup is complete your events would be sent to engage.so

### Events
The app also processes and sends extra properties or meta-data of the events to engage.so eg.

```posthog.identify(
    '[user unique id]', // distinct_id, required
    { userProperty: 'value1' }, // $set, optional
    { anotherUserProperty: 'value2' } // $set_once, optional
);
```
The example above using the Posthog JS SDK appends extra properties to the identify event. 
These extra properties will be sent as well to engage.so