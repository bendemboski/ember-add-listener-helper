import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, type TestContext } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { sendEvent } from '@ember/object/events';
import sinon from 'sinon';

module('Integration | Helpers | ember-loose', function (hooks) {
  setupRenderingTest(hooks);

  test('it works in ember-loose', async function (assert) {
    interface ThisContext extends TestContext {
      obj?: object;
      callback?: () => void;
    }

    const obj = {};
    const callback = sinon.stub();

    (this as ThisContext).obj = obj;
    (this as ThisContext).callback = callback;

    await render<ThisContext>(
      hbs`{{add-listener this.obj 'thing' this.callback}}`,
    );
    assert.strictEqual(callback.callCount, 0);

    sendEvent(obj, 'thing', ['arg1', 2]);
    assert.strictEqual(callback.callCount, 1);
    assert.deepEqual(callback.lastCall.args, ['arg1', 2]);
  });
});
