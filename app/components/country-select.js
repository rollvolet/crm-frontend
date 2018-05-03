import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { warn } from '@ember/debug';

export default Component.extend({
  store: service(),
  init() {
    this._super(...arguments);
    const countries = this.store.peekAll('country');
    if (this.value == null) {
      const defaultValue = countries.find(c => c.get('code') == 'BE');
      warn("No default country with code 'BE' found", defaultValue != null, { id: 'select.no-default-value' });
      this.set('value', defaultValue);
    }
    this.set('options', countries);
  },
  label: 'Land',
  value: null
});
