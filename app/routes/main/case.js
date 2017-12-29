import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.get('store').findRecord('customer', params.customer_id, {
      include: 'language,country,honorific-prefix,telephones'
    });
  }
});
