import DS from 'ember-data';
import HasManyQuery from 'ember-data-has-many-query';
import { computed } from '@ember/object';
import { validator, buildValidations } from 'ember-cp-validations';
import { dateString } from '../utils/date-string';

const Validations = buildValidations({
  orderDate: validator('presence', true),
  amount: validator('number', {
    allowBlank: true,
    positive: true
  }),
  scheduledHours: validator('number', {
    allowBlank: true,
    positive: true
  }),
  scheduledNbOfPersons: validator('number', {
    allowBlank: true,
    positive: true
  }),
  invoicableHours: validator('number', {
    allowBlank: true,
    positive: true
  }),
  invoicableNbOfPersons: validator('number', {
    allowBlank: true,
    positive: true
  })
});

export default DS.Model.extend(HasManyQuery.ModelMixin, Validations, {
  orderDate: DS.attr('date'),
  offerNumber: DS.attr(),
  amount: DS.attr('number'),
  depositRequired: DS.attr('boolean'),
  hasProductionTicket: DS.attr('boolean'),
  mustBeInstalled: DS.attr('boolean'),
  mustBeDelivered: DS.attr('boolean'),
  isReady: DS.attr('boolean'),
  expectedDate: DS.attr('date'),
  requiredDate: DS.attr('date'),
  scheduledHours: DS.attr('number'),
  scheduledNbOfPersons: DS.attr('number'),
  invoicableHours: DS.attr('number'),
  invoicableNbOfPersons: DS.attr('number'),
  comment: DS.attr(),
  canceled: DS.attr('boolean'),
  cancellationReason: DS.attr(),
  offer: DS.belongsTo('offer'),
  invoice: DS.belongsTo('invoice'),
  customer: DS.belongsTo('customer'),
  contact: DS.belongsTo('contact'),
  building: DS.belongsTo('building'),
  vatRate: DS.belongsTo('vat-rate'),
  deposits: DS.hasMany('deposit'),
  depositInvoices: DS.hasMany('deposit-invoices'),

  scheduledTotal: computed('scheduledHours', 'scheduledNbOfPersons', function() {
    return this.scheduledHours * this.scheduledNbOfPersons;
  }),
  invoicableTotal: computed('invoicableHours', 'invoicableNbOfPersons', function() {
    return this.invoicableHours * this.invoicableNbOfPersons;
  }),
  execution: computed('mustBeInstalled', 'mustBeDelivered', function() {
    if (this.mustBeInstalled) return 'installation';
    else if (this.mustBeDelivered) return 'delivery';
    else return 'pickup';
  }),
  orderDateStr: dateString('orderDate'),
  expectedDateStr: dateString('expectedDate'),
  requiredDateStr: dateString('requiredDate')
});
