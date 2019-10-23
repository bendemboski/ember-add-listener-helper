import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, clearRender, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { sendEvent } from '@ember/object/events';
import sinon from 'sinon';

module('Integration | Helpers | add-listener', function(hooks) {
  setupRenderingTest(hooks);

  test('it works', async function(assert) {
    this.setProperties({
      obj: {},
      callback: sinon.stub()
    });

    await render(hbs`{{add-listener this.obj 'thing' this.callback}}`);
    assert.equal(this.callback.callCount, 0);

    sendEvent(this.obj, 'thing', [ 'arg1', 2 ]);
    assert.equal(this.callback.callCount, 1);
    assert.deepEqual(this.callback.lastCall.args, [ 'arg1', 2 ]);

    sendEvent(this.obj, 'thing', [ 'anotherArg1', false ]);
    assert.equal(this.callback.callCount, 2);
    assert.deepEqual(this.callback.lastCall.args, [ 'anotherArg1', false ]);

    await clearRender();

    sendEvent(this.obj, 'thing', [ 'arg1', 4 ]);
    assert.equal(this.callback.callCount, 2);
  });

  test('the target can change', async function(assert) {
    let obj1 = {};
    let obj2 = {};
    this.setProperties({
      obj: obj1,
      callback: sinon.stub()
    });

    await render(hbs`{{add-listener this.obj 'thing' this.callback}}`);
    assert.equal(this.callback.callCount, 0);

    sendEvent(obj1, 'thing', [ 'arg' ]);
    assert.equal(this.callback.callCount, 1);

    sendEvent(obj2, 'thing', [ 'arg' ]);
    assert.equal(this.callback.callCount, 1);

    this.set('obj', obj2);
    await settled();

    sendEvent(obj1, 'thing', [ 'arg' ]);
    assert.equal(this.callback.callCount, 1);

    sendEvent(obj2, 'thing', [ 'arg' ]);
    assert.equal(this.callback.callCount, 2);
  });

  test('the event can change', async function(assert) {
    this.setProperties({
      obj: {},
      event: 'event1',
      callback: sinon.stub()
    });

    await render(hbs`{{add-listener this.obj this.event this.callback}}`);
    assert.equal(this.callback.callCount, 0);

    sendEvent(this.obj, 'event1', [ 'arg' ]);
    assert.equal(this.callback.callCount, 1);

    sendEvent(this.obj, 'event2', [ 'arg' ]);
    assert.equal(this.callback.callCount, 1);

    this.set('event', 'event2');
    await settled();

    sendEvent(this.obj, 'event1', [ 'arg' ]);
    assert.equal(this.callback.callCount, 1);

    sendEvent(this.obj, 'event2', [ 'arg' ]);
    assert.equal(this.callback.callCount, 2);
  });

  test('the callback can change', async function(assert) {
    let callback1 = sinon.stub();
    let callback2 = sinon.stub();
    this.setProperties({
      obj: {},
      callback: callback1
    });

    await render(hbs`{{add-listener this.obj 'thing' this.callback}}`);
    assert.equal(this.callback.callCount, 0);

    sendEvent(this.obj, 'thing', [ 'arg' ]);
    assert.equal(callback1.callCount, 1);
    assert.equal(callback2.callCount, 0);

    this.set('callback', callback2);
    await settled();

    sendEvent(this.obj, 'thing', [ 'arg' ]);
    assert.equal(callback1.callCount, 1);
    assert.equal(callback2.callCount, 1);
  });

  test('it handles un-set arguments', async function(assert) {
    // Render with nothing set
    await render(hbs`{{add-listener this.obj this.event this.callback}}`);

    // No callback -- make sure no errors are thrown when sending event
    this.setProperties({
      obj: {},
      event: 'event1',
      callback: null
    });
    await settled();
    sendEvent(this.obj, 'thing', [ 'arg' ]);

    // No event
    this.setProperties({
      obj: {},
      event: null,
      callback: sinon.stub()
    });
    await settled();
    sendEvent(this.obj, 'thing', [ 'arg' ]);
    assert.notOk(this.callback.called);

    // No object
    this.setProperties({
      obj: null,
      event: 'thing',
      callback: sinon.stub()
    });
    await settled();

    // Set the object and make sure everything functions
    this.set('obj', {});
    await settled();
    sendEvent(this.obj, 'thing', [ 'arg' ]);
    assert.equal(this.callback.callCount, 1);
    assert.deepEqual(this.callback.firstCall.args, [ 'arg' ]);
  });
});
