import Route from '@ember/routing/route';
import { action } from '@ember/object';
import ArrayProxy from '@ember/array/proxy';
import fetch from 'fetch';
import OutstandingJob from '../../../../classes/outstanding-job';
import getPaginationMetadata from '../../../../utils/get-pagination-metadata';
import Snapshot from '../../../../utils/snapshot';

export default class MainReportsOutstandingJobsIndexRoute extends Route {
  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    visitorName: { refreshModel: true },
    orderDate: { refreshModel: true }, // format yyyy-mm-dd
    hasProductionTicket: { refreshModel: true },
    execution: { refreshModel: true },
    isProductReady: { refreshModel: true },
  }

  sortFieldOptions = [
    { label: 'Besteldatum', value: 'order-date' },
    { label: 'Verwachte datum', value: 'expected-date' },
    { label: 'Vereiste datum', value: 'required-date' },
    { label: 'Geplande datum', value: 'planning-date' }
  ];

  sortDirectionOptions = [
    { label: 'Nieuwste eerst', value: 'desc' },
    { label: 'Oudste eerst', value: 'asc' }
  ];

  constructor() {
    super(...arguments);
    this.lastParams = new Snapshot();
  }

  async model(params) {
    if (!params.orderDate) {
      const orderDate = new Date();
      orderDate.setYear(orderDate.getFullYear() - 1);
      params.orderDate = orderDate.toISOString().substr(0, 10);
    }

    this.lastParams.stageLive(params);

    if (this.lastParams.anyFieldChanged(Object.keys(params).filter((key) => key !== 'page'))) {
      params.page = 0;
    }

    const endpoint = new URL(`/api/reports/outstanding-jobs`, window.location.origin);
    const searchParams = new URLSearchParams(Object.entries({
      'page[size]': params.size,
      'page[number]': params.page,
      'sort': params.sort,
    }));

    if (params.visitorName)
      searchParams.append('filter[visitor]', params.visitorName);

    if (params.execution == 'delivery') {
      searchParams.append('filter[mustBeDelivered]', 1);
      searchParams.append('filter[mustBeInstalled]', 0);
    } else if (params.execution == 'installation') {
      searchParams.append('filter[mustBeDelivered]', 0);
      searchParams.append('filter[mustBeInstalled]', 1);
    } else if (params.execution == 'pickup') {
      searchParams.append('filter[mustBeDelivered]', 0);
      searchParams.append('filter[mustBeInstalled]', 0);
    } else {
      searchParams.append('filter[mustBeDelivered]', -1);
      searchParams.append('filter[mustBeInstalled]', -1);
    }

    searchParams.append('filter[orderDate]', params.orderDate);
    searchParams.append('filter[hasProductionTicket]', params.hasProductionTicket);
    searchParams.append('filter[isProductReady]', params.isProductReady);

    endpoint.search = searchParams.toString();

    const response = await (await fetch(endpoint)).json();
    const entries = response.data.map(item => new OutstandingJob(item.attributes));
    const count = response.meta.count;
    const pagination = getPaginationMetadata(response.meta.page.number, response.meta.page.size, count);

    // Preload selected values value for ember-power-select
    if (params.visitorName) {
      let visitors = this.store.peekAll('employee');
      if (!visitors.length)
        visitors = await this.store.findAll('employee');
      this.visitor = visitors.find(e => e.firstName == params.visitorName);
    } else {
      this.visitor = null;
    }
    if (params.sort) {
      if (params.sort.startsWith('-')) {
        this.sortDirection = this.sortDirectionOptions.find(o => o.value == 'desc');
        this.sortField = this.sortFieldOptions.find(o => o.value == params.sort.slice(1));
      } else {
        this.sortDirection = this.sortDirectionOptions.find(o => o.value == 'asc');
        this.sortField = this.sortFieldOptions.find(o => o.value == params.sort);
      }
    }

    this.lastParams.commit();

    return ArrayProxy.create({
      content: entries,
      meta: {
        count,
        pagination
      }
    });
  }

  setupController(controller) {
    super.setupController(...arguments);

    controller.sortDirectionOptions = this.sortDirectionOptions;
    controller.sortFieldOptions = this.sortFieldOptions;

    controller.visitor = this.visitor;
    controller.sortDirection = this.sortDirection;
    controller.sortField = this.sortField;

    if (controller.page != this.lastParams.committed.page) {
      controller.set('page', this.lastParams.committed.page);
    }
  }

  @action
  loading(transition) {
    const controller = this.controllerFor(this.routeName);
    controller.set('isLoadingModel', true);
    transition.promise.finally(function() {
      controller.set('isLoadingModel', false);
    });

    return true; // bubble the loading event
  }

  async afterModel() {
  }
}
