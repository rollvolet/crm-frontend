import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { all } from 'ember-concurrency';
import { warn } from '@ember/debug';

export default class OrderPanelsComponent extends Component {
  @service case
  @service router

  get isDisabledEdit() {
    return this.args.model.isMasteredByAccess || this.case.current.invoice != null;
  }

  get isEnabledDelete() {
    return !this.args.model.isMasteredByAccess
      && this.case.current.invoice == null
      && !this.args.model.deposits.length
      && !this.args.model.depositInvoices.length;
  }

  @task
  *delete() {
    try {
      const invoicelines = yield this.args.model.invoicelines;
      yield all(invoicelines.map(t => t.destroyRecord()));
      this.case.updateRecord('order', null);
      yield this.args.model.destroyRecord();
      this.router.transitionTo('main.case.offer.edit', this.case.current.offer.id);
    } catch (e) {
      warn(`Something went wrong while destroying order ${this.args.model.id}`, { id: 'destroy-failure' });
      this.case.current.offer.order = this.args.model;
      yield this.case.current.offer.save();
      yield this.args.model.rollbackAttributes(); // undo delete-state
      this.case.updateRecord('order', this.args.model);
    }
  }
}