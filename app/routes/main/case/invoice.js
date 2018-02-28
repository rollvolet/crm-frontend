import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.get('store').findRecord('invoice', params.invoice_id, {
      include: 'building,contact,vat-rate,supplements,deposits,deposit-invoices'
    });
  },
  afterModel(model) {
    const controller = this.controllerFor('main.case');
    controller.set('building', model.get('building'));
    controller.set('contact', model.get('contact'));
  }
});
