import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class IndexRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'order';

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    // filter params
    offerNumber: { refreshModel: true },
    requestNumber: { refreshModel: true },
    visitor: { refreshModel: true },
    reference: { refreshModel: true },
    withoutInvoice: { refreshModel: true },
    onlyNotCanceled: { refreshModel: true },
    cName: { refreshModel: true },
    cPostalCode: { refreshModel: true },
    cCity: { refreshModel: true },
    cStreet: { refreshModel: true },
    cTelephone: { refreshModel: true },
    bName: { refreshModel: true },
    bPostalCode: { refreshModel: true },
    bCity: { refreshModel: true },
    bStreet: { refreshModel: true }
  };

  mergeQueryOptions(params) {
    return {
      include: 'customer,customer.honorific-prefix,building,offer',
      filter: {
        'request-number': params.requestNumber,
        'offer-number': params.offerNumber,
        reference: params.reference,
        invoice: !params.withoutInvoice,
        canceled: !params.onlyNotCanceled,
        offer: {
          request: {
            visitor: params.visitor,
          }
        },
        customer: {
          name: params.cName,
          'postal-code': params.cPostalCode,
          city: params.cCity,
          street: params.cStreet,
          telephone: params.cTelephone
        },
        building: {
          name: params.bName,
          'postal-code': params.bPostalCode,
          city: params.bCity,
          street: params.bStreet
        }
      }
    };
  }
}
