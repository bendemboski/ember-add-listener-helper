import type AddListenerHelper from './helpers/add-listener.ts';

export default interface EmberAddListenerHelperRegistry {
  'add-listener': typeof AddListenerHelper;
}
