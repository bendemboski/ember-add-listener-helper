ember-add-listener-helper
==============================================================================

Easily and safely use `@ember/object/events` via a template helper

```hbs
{{add-listener @publisher 'event' this.onEvent}}
```

Usage
------------------------------------------------------------------------------

The `@ember/object/events` methods require careful accounting to avoid leaking
event listeners, and are especially tricky to use when the subscriber is a
glimmer component and the publisher is an argument to that component. Using the
`{{add-listener}}` helper makes it a no-brainer, as it will handle registering,
un/re-registering when arguments change, and unregistering on un-render. All
you have to do is:

```hbs
{{add-listener @publisher 'event' this.onEvent}}
```

```javascript
export default class MyComponent extends Component {
  @action
  this.onEvent(arg1, arg2) {
    // handle event
  }
}
```

`@publisher` can be an object with events triggered using `sendEvent` from
`@ember/objects/events` or using `.trigger()` from the `Ember.Evented` mixin.

Isn't Ember's eventing deprecated?
------------------------------------------------------------------------------
There is [an RFC](https://github.com/emberjs/rfcs/pull/528) to deprecate Ember's
eventing. As long as it's not deprecated and removed, this helper eases its use.
If/when Ember's eventing is removed, this helper may also be deprecated, or may
switch its implementation to using some other recommended pub/sub eventing
library.

Compatibility
------------------------------------------------------------------------------

* Ember.js v3.20 or above
* Ember CLI v3.20 or above
* Node.js v12 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-add-listener-helper
```


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
