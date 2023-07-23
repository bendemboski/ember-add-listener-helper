import Helper from '@ember/component/helper';
import { addListener, removeListener } from '@ember/object/events';

// We define these explicitly rather than using `Parameters<typeof addListener>`
// because `addListener`'s arguments were typed incorrectly in earlier preview
// versions of Ember types.
type PositionalArgs = [
  obj?: object,
  eventName?: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  target?: object | Function | null,
  // eslint-disable-next-line @typescript-eslint/ban-types
  method?: Function,
  sync?: boolean,
];

interface AddListenerHelperSignature {
  Args: {
    Positional: PositionalArgs;
  };
  Return: undefined;
}

export default class AddListenerHelper extends Helper<AddListenerHelperSignature> {
  private removeListener?: () => void;

  compute(args: PositionalArgs) {
    this.checkRemoveListener();

    const [obj, eventName, target, method, once] = args;
    // method and once are optional
    if (!obj || !eventName || !target) {
      return undefined;
    }

    addListener(obj, eventName, target, method, once);
    this.removeListener = () => removeListener(obj, eventName, target, method);
    return undefined;
  }

  willDestroy() {
    this.checkRemoveListener();
    super.willDestroy();
  }

  checkRemoveListener() {
    if (this.removeListener) {
      this.removeListener();
      delete this.removeListener;
    }
  }
}
