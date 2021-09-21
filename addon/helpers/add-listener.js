import Helper from '@ember/component/helper';
import { addListener, removeListener } from '@ember/object/events';

export default class AddListenerHelper extends Helper {
  compute([target, event, callback]) {
    this.checkRemoveListener();

    if (!target || !event || !callback) {
      return;
    }

    addListener(target, event, callback);
    this.removeListener = () => removeListener(target, event, callback);
  }

  willDestroy() {
    this.checkRemoveListener();
    super.willDestroy(...arguments);
  }

  checkRemoveListener() {
    if (this.removeListener) {
      this.removeListener();
      this.removeListener = null;
    }
  }
}
