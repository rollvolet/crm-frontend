import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class DepositInvoicesRoute extends Route {
  model() {
    const order = this.modelFor('main.case.order.edit');
    return order.query('depositInvoices', { // TODO replace with query on depositInvoices filtered by orderId
      sort: '-number',
      page: {
        size: 1000 // we don't expect more than 1000 deposit invoices for 1 order
      },
      include: 'building,contact,vat-rate'
    });
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    const customer = this.modelFor('main.case');
    controller.set('customer', customer);

    const order = this.modelFor('main.case.order.edit');
    controller.set('order', order);
  }
}
