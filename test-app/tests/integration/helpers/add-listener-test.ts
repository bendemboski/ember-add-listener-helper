import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, clearRender, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { tracked } from '@glimmer/tracking';
import { sendEvent } from '@ember/object/events';
import sinon from 'sinon';

class Context {
  @tracked obj?: object;
  @tracked event?: string;
  @tracked callback?: () => void;
}

interface ThisContext {
  context: Context;
}

module('Integration | Helpers | add-listener', function (hooks) {
  setupRenderingTest(hooks);

  let context: Context;

  hooks.beforeEach(function (this: ThisContext) {
    context = new Context();
    this.context = context;
  });

  test('it works', async function (assert) {
    const obj = {};
    const callback = sinon.stub();

    context.obj = obj;
    context.callback = callback;

    await render<ThisContext>(
      hbs`{{add-listener this.context.obj 'thing' this.context.callback}}`,
    );
    assert.strictEqual(callback.callCount, 0);

    sendEvent(obj, 'thing', ['arg1', 2]);
    assert.strictEqual(callback.callCount, 1);
    assert.deepEqual(callback.lastCall.args, ['arg1', 2]);

    sendEvent(obj, 'thing', ['anotherArg1', false]);
    assert.strictEqual(callback.callCount, 2);
    assert.deepEqual(callback.lastCall.args, ['anotherArg1', false]);

    await clearRender();

    sendEvent(obj, 'thing', ['arg1', 4]);
    assert.strictEqual(callback.callCount, 2);
  });

  test('the target can change', async function (assert) {
    const obj1 = {};
    const obj2 = {};
    const callback = sinon.stub();

    context.obj = obj1;
    context.callback = callback;

    await render<ThisContext>(
      hbs`{{add-listener this.context.obj 'thing' this.context.callback}}`,
    );
    assert.strictEqual(callback.callCount, 0);

    sendEvent(obj1, 'thing', ['arg']);
    assert.strictEqual(callback.callCount, 1);

    sendEvent(obj2, 'thing', ['arg']);
    assert.strictEqual(callback.callCount, 1);

    context.obj = obj2;
    await settled();

    sendEvent(obj1, 'thing', ['arg']);
    assert.strictEqual(callback.callCount, 1);

    sendEvent(obj2, 'thing', ['arg']);
    assert.strictEqual(callback.callCount, 2);
  });

  test('the event can change', async function (assert) {
    const obj = {};
    const callback = sinon.stub();

    context.obj = obj;
    context.event = 'event1';
    context.callback = callback;

    await render<ThisContext>(
      hbs`{{add-listener this.context.obj this.context.event this.context.callback}}`,
    );
    assert.strictEqual(callback.callCount, 0);

    sendEvent(obj, 'event1', ['arg']);
    assert.strictEqual(callback.callCount, 1);

    sendEvent(obj, 'event2', ['arg']);
    assert.strictEqual(callback.callCount, 1);

    context.event = 'event2';
    await settled();

    sendEvent(obj, 'event1', ['arg']);
    assert.strictEqual(callback.callCount, 1);

    sendEvent(obj, 'event2', ['arg']);
    assert.strictEqual(callback.callCount, 2);
  });

  test('the callback can change', async function (assert) {
    const obj = {};
    const callback1 = sinon.stub();
    const callback2 = sinon.stub();

    context.obj = obj;
    context.callback = callback1;

    await render<ThisContext>(
      hbs`{{add-listener this.context.obj 'thing' this.context.callback}}`,
    );
    assert.strictEqual(callback1.callCount, 0);

    sendEvent(obj, 'thing', ['arg']);
    assert.strictEqual(callback1.callCount, 1);
    assert.strictEqual(callback2.callCount, 0);

    context.callback = callback2;
    await settled();

    sendEvent(obj, 'thing', ['arg']);
    assert.strictEqual(callback1.callCount, 1);
    assert.strictEqual(callback2.callCount, 1);
  });

  test('it handles un-set arguments', async function (assert) {
    // Render with nothing set
    await render<ThisContext>(
      hbs`{{add-listener this.context.obj this.context.event this.context.callback}}`,
    );

    // No callback -- make sure no errors are thrown when sending event
    const obj = {};
    context.obj = obj;
    context.event = 'event1';
    context.callback = undefined;
    await settled();

    sendEvent(obj, 'thing', ['arg']);

    // No event
    const callback = sinon.stub();

    context.obj = obj;
    context.event = undefined;
    context.callback = callback;
    await settled();

    sendEvent(obj, 'thing', ['arg']);
    assert.notOk(callback.called);

    // No object
    context.obj = undefined;
    context.event = 'thing';
    context.callback = callback;
    await settled();

    // Set the object and make sure everything functions
    context.obj = obj;
    await settled();
    sendEvent(obj, 'thing', ['arg']);
    assert.strictEqual(callback.callCount, 1);
    assert.deepEqual(callback.firstCall.args, ['arg']);
  });
});
