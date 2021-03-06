import Controller from '@ember/controller';
import { action } from '@ember/object';
import DefaultQueryParams from 'ember-data-table/mixins/default-query-params';
import applyFilterParams from '../../../utils/apply-filter-params';

export default class IndexController extends Controller.extend(DefaultQueryParams) {
  size = 25
  sort = '-number'

  @action
  clickRow(row) {
    const customerId = row.get('customer.id');
    const orderId = row.get('order.id');
    this.transitionToRoute('main.case.order.edit.deposit-invoices', customerId, orderId);
  }

  @action
  applyFilter(filter) {
    applyFilterParams.bind(this)(filter);
  }
}
