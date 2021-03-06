import Controller from '@ember/controller';
import DefaultQueryParams from 'ember-data-table/mixins/default-query-params';
import { task } from 'ember-concurrency-decorators';
import { action } from '@ember/object';
import applyFilterParams from '../../../../utils/apply-filter-params';

export default class CustomerController extends Controller.extend(DefaultQueryParams) {
  size = 25;

  @task
  *linkCustomerToRequest(customer) {
    this.request.customer = customer;
    yield this.request.save();
    this.transitionToRoute('main.case.request.edit', customer, this.request);
  }

  @action
  applyFilter(filter) {
    applyFilterParams.bind(this)(filter);
  }
}
