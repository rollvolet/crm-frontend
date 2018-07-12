import { computed } from '@ember/object';
import Component from '@ember/component';
import { task, all } from 'ember-concurrency';
import { warn } from '@ember/debug';
import { equal } from '@ember/object/computed';

export default Component.extend({
  model: null,
  onClose: null,
  onRemove: null,

  scope: 'customer', // one of 'customer', 'contact', 'building'
  isScopeCustomer: equal('scope', 'customer'),
  showWarningOnLeaveDialog: false,

  hasFailedTelephone: computed('model.telephones.[]', function() {
    return this.model.telephones.find(t => t.isNew || t.validations.isInvalid || t.isError) != null;
  }),

  remove: task(function * () {
    try {
      yield all(this.model.telephones.map(t => t.destroyRecord()));
      // TODO remove contacts/buildings ?
      yield this.model.destroyRecord();
    } catch (e) {
      warn(`Something went wrong while destroying ${this.scope} ${this.model.id}`, { id: 'destroy-failure' });
    } finally {
      this.onRemove();
    }
  }),
  rollbackTree: task( function * () {
    this.model.rollbackAttributes();
    const rollbackPromises = [];
    const telephones = yield this.model.get('telephones');
    telephones.forEach( (telephone) => {
      telephone.rollbackAttributes();
      rollbackPromises.push(telephone.belongsTo('country').reload());
      rollbackPromises.push(telephone.belongsTo('telephoneType').reload());
    });
    rollbackPromises.push(this.model.belongsTo('country').reload());
    rollbackPromises.push(this.model.belongsTo('language').reload());
    rollbackPromises.push(this.model.belongsTo('honorificPrefix').reload());
    yield all(rollbackPromises);
  }),
  save: task(function * () {
    const { validations } = yield this.model.validate();
    if (validations.isValid)
      yield this.model.save();
  }).keepLatest(),

  actions: {
    close() {
      if (this.model.isNew || this.model.validations.isInvalid || this.model.isError
          || (this.save.last && this.save.last.isError)
          || this.hasFailedTelephone) {
        this.set('showUnsavedChangesDialog', true);
      } else {
        this.onClose();
      }
    },
    confirmClose() {
      this.rollbackTree.perform();
      this.onClose();
    },
    setPostalCode(code, city) {
      this.model.set('postalCode', code);
      this.model.set('city', city);
    },
    setIsCompany(isCompany) {
      if (!isCompany)
        this.model.set('vatNumber', null);

      this.model.set('isCompany', isCompany);
      this.save.perform();
    }
  }
});
