import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { guidFor } from '@ember/object/internals';

export default class MainReportsOutstandingJobsIndexController extends Controller {
  @service router;

  page = 0;
  size = 100;
  sort = 'order-date';
  hasProductionTicket = -1;
  execution = 'na';
  isProductReady = -1;

  executionOptions = [
    { label: 'n.v.t.', value: 'na', id: `na-${guidFor(this)}` },
    { label: 'te leveren', value: 'delivery', id: `yes-${guidFor(this)}` },
    { label: 'te plaatsen', value: 'installation', id: `no-${guidFor(this)}` },
    { label: 'af te halen', value: 'pickup', id: `no-${guidFor(this)}` }
  ];

  @tracked sortDirectionOptions; // initialized in route
  @tracked sortFieldOptions; // initialized in route

  @tracked visitor;
  @tracked sortField;
  @tracked sortDirection;

  constructor() {
    super(...arguments);
    if (!this.orderDate) {
      const orderDate = new Date();
      orderDate.setYear(orderDate.getFullYear() - 1);
      this.set('orderDate', orderDate.toISOString().substr(0, 10));
    }
  }

  @action
  goToOrder(row, e) {
    if (e.target.getAttribute('role') != 'button') {
      this.transitionToRoute('main.case.order.edit', row.customerNumber, row.orderId);
    }
    // else: prevent transition if expandComment is clicked
  }

  @action
  selectVisitor(employee) {
    this.visitor = employee;
    this.set('visitorName', employee && employee.firstName);
  }

  @action
  print() {
    this.router.transitionTo('main.reports.outstanding-jobs.print', {
      queryParams: {
        visitorName: this.visitorName,
        orderDate: this.orderDate,
        hasProductionTicket: this.hasProductionTicket,
        execution: this.execution,
        isProductReady: this.isProductReady
      }
    });
  }

  @action
  toggleComment(row) {
    row.expandComment = !row.expandComment;
  }

  @action
  setSortField(option) {
    this.sortField = option;
    const sort = this.sortDirection.value == 'desc' ? `-${this.sortField.value}` : this.sortField.value;
    this.set('sort', sort);
  }

  @action
  setSortDirection(option) {
    this.sortDirection = option;
    const sort = this.sortDirection.value == 'desc' ? `-${this.sortField.value}` : this.sortField.value;
    this.set('sort', sort);
  }
}
