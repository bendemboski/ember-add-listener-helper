import type AddListenerHelper from './helpers/add-listener';

export default interface EmberAddListenerHelperRegistry {
  'add-listener': typeof AddListenerHelper;
}
