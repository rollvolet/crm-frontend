import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, keepLatestTask } from 'ember-concurrency-decorators';
import { all } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default class InvoiceDocumentEditComponent extends Component {
  @service store

  @tracked invoicelines = []
  @tracked isOutroExpanded = false

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @keepLatestTask
  *loadData() {
    yield this.args.model.sideload('vatRate');
    // load data that is already loaded by the invoice/panel component
    const invoicelines = yield this.args.model.invoicelines;
    yield all(invoicelines.map(line => line.sideload('order,invoice,vat-rate')));
    this.invoicelines = invoicelines.toArray();
  }

  get sortedInvoicelines() {
    return this.invoicelines.sortBy('sequenceNumber');
  }

  get isEnabledAddingInvoicelines() {
    return this.vatRate.get('id') != null;
  }

  get vatRate() {
    return this.args.model.vatRate;
  }

  @task
  *addInvoiceline() {
    const number = this.invoicelines.length ? Math.max(...this.invoicelines.map(l => l.sequenceNumber)) : 0;
    const invoiceline = this.store.createRecord('invoiceline', {
      sequenceNumber: number + 1,
      invoice: this.args.model,
      vatRate: this.vatRate
    });

    const { validations } = yield invoiceline.validate();
    if (validations.isValid)
      invoiceline.save();

    this.invoicelines.pushObject(invoiceline);
  }

  @task
  *deleteInvoiceline(invoiceline) {
    if (invoiceline.isNew)
      invoiceline.rollbackAttributes();
    this.invoicelines.removeObject(invoiceline);
    yield invoiceline.destroyRecord();
  }
}
