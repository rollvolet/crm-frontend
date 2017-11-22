import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'customer',
  mergeQueryOptions() {
    return {
      include: 'language,country,honorific-prefix'
    };
  }
});
