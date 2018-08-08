import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('request', params.request_id, {
      include: 'way-of-entry,building,contact,offer'
    });
  },
  afterModel(model) {
    const controller = this.controllerFor('main.case');
    controller.set('building', model.get('building'));
    controller.set('contact', model.get('contact'));
  }
});
