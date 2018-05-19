import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { warn } from '@ember/debug';

export default Component.extend({
  store: service(),
  init() {
    this._super(...arguments);
    const languages = this.store.peekAll('language');
    this.set('options', languages);
  },
  label: 'Taal',
  value: null,
  onSelectionChange: null
});
