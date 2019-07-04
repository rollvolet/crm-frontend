import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'accountancy-export',

  actions: {
    refreshModel() {
      this.refresh();
    }
  }
});
