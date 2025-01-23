## on-one

Subscribe to one or more events and accept the first emitted.

# one event
```
import oo = from 'on-one';

oo(stream, 'data', (chunk) => {
  // first chunk only
})
```

# multiple events
```
import oo = from 'on-one';

oo(stream, ['error', 'finish'], (err) => {
  // it depends on if there was an error
})
```
