import classic from 'ember-classic-decorator';
import { classNames } from '@ember-decorators/component';
import { observes } from '@ember-decorators/object';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import FilterComponent from '../data-table-filter';
import { task } from 'ember-concurrency';

@classic
@classNames('buildings-table')
export default class BuildingsTable extends FilterComponent {
  @service
  store;

  page = 0;
  size = 10;
  sort = 'name';
  filterKeys = Object.freeze(['number', 'name', 'postalCode', 'city', 'street', 'telephone'])

  init() {
    super.init(...arguments);
    this.search.perform(this.getFilter());
  }

  async onChange(filter) {
    await this.search.perform(filter);
  }

  @observes('page', 'size', 'sort')
  dataTableParamChanged() { // eslint-disable-line ember/no-observers
    this.search.perform(this.getFilter());
  }

  @task(function * (filter) {
    const buildings = yield this.store.query('building', {
      page: {
        size: this.size,
        number: this.page
      },
      sort: this.sort,
      include: 'country,language,honorific-prefix',
      filter: {
        customer: {
          number: this.customer.number
        },
        number: filter.number,
        name: filter.name,
        'postal-code': filter.postalCode,
        city: filter.city,
        street: filter.street,
        telephone: filter.telephone
      }
    });
    this.set('buildings', buildings);
  })
  search;

  @action
  edit(building) {
    this.onEdit(building);
  }
}
