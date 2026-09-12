# on-one

Subscribe to one or more events and accept the first emitted.

```bash
npm install on-one
```

```js
var EventEmitter = require('events').EventEmitter;
var onOne = require('on-one');
var emitter = new EventEmitter();

onOne(emitter, ['error', 'finish'], function (err, eventName) {
  if (eventName === 'error') {
    console.error('Stream failed:', err);
  } else {
    console.log('Stream finished successfully');
  }
});

emitter.emit('finish'); // logs the success message
```

The callback receives the error event's error as its first argument. Other
events pass `null`, followed by their event arguments and the event name. After
the first event, all listeners installed by `onOne` are removed.
