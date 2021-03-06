import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CaseTabsComponent extends Component {
  @service case
  @service router
  @service store

  @tracked currentRouteName
  @tracked isEditRoute

  constructor() {
    super(...arguments);
    this.case.initCase.perform();
    this.currentRouteName = this.router.currentRoute.name;
    this.isEditRoute = this.router.currentRoute.queryParams.editMode == "true";

    this.router.on('routeWillChange', (transition) => {
      const target = transition.to.name;
      if (!target.startsWith('main.case'))
        this.case.unloadCase();
    });

    this.router.on('routeDidChange', (transition) => {
      const target = transition.to.name;
      if (target.startsWith('main.case') && this.case.isInvalid)
        this.case.initCase.perform();
      this.currentRouteName = this.router.currentRoute.name;
      this.isEditRoute = this.router.currentRoute.queryParams.editMode == "true";
    });
  }

  get model() {
    return this.case.current;
  }

  get visitor() {
    return this.case.visitor;
  }

  get canCreateNewOffer() {
    return !this.isEditRoute && this.model && this.model.customerId && this.model.requestId && this.model.offerId == null;
  }

  get canCreateNewOrder() {
    return !this.isEditRoute && this.model && this.model.offerId && this.model.orderId == null && this.model.offer && !this.model.offer.isMasteredByAccess;
  }

  get canCreateNewInvoice() {
    const canCreateNewInvoiceForOrder = this.model && this.model.orderId && this.model.invoiceId == null && this.model.order && !this.model.order.isMasteredByAccess && !this.model.order.canceled;
    const canCreateNewInvoiceForIntervention = this.model && this.model.customerId && this.model.interventionId && this.model.invoiceId == null && !this.model.intervention.isCancelled;
    return !this.isEditRoute && (canCreateNewInvoiceForOrder || canCreateNewInvoiceForIntervention);
  }

  @action
  openNewOffer() {
    const customerId = this.model.customerId;
    const requestId = this.model.requestId;
    this.router.transitionTo('main.case.request.edit.offer', customerId, requestId);
  }

  @action
  openNewOrder() {
    const customerId = this.model.customerId;
    const offerId = this.model.offerId;
    this.router.transitionTo('main.case.offer.edit.order', customerId, offerId);
  }

  @action
  openNewInvoice() {
    const customerId = this.model.customerId;
    const orderId = this.model.orderId;
    if (orderId) {
      this.router.transitionTo('main.case.order.edit.invoice', customerId, orderId);
    } else {
      const interventionId = this.model.interventionId;
      this.router.transitionTo('main.case.intervention.edit.invoice', customerId, interventionId);
    }
  }
}
