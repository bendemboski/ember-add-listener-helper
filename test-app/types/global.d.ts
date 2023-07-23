import 'ember-source/types';
// We need this for the pre-stable types ember try scenarios
import 'ember-source/types/preview';
import '@glint/environment-ember-loose';

import EmberAddListenerHelperRegistry from 'ember-add-listener-helper/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export default interface Registry extends EmberAddListenerHelperRegistry {}
}
