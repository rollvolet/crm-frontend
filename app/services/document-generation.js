import Service, { inject } from '@ember/service';
import fetch, { Headers } from 'fetch';

export default class DocumentGenerationService extends Service {
  @inject session

  // Document generation

  async visitReport(request) {
    await this._generate(`/api/requests/${request.get('id')}/reports`);
    this.downloadVisitReport(request);
  }

  async interventionReport(intervention) {
    await this._generate(`/api/interventions/${intervention.get('id')}/reports`);
    this.downloadInterventionReport(intervention);
  }

  async offerDocument(offer) {
    await this._generate(`/api/offers/${offer.get('id')}/documents`);
    this.downloadOfferDocument(offer);
  }

  async orderDocument(order) {
    await this._generate(`/api/orders/${order.get('id')}/documents`);
    this.downloadOrderDocument(order);
  }

  async deliveryNote(order) {
    await this._generate(`/api/orders/${order.get('id')}/delivery-notes`);
    this.downloadDeliveryNote(order);
  }

  async productionTicketTemplate(order) {
    await this._generate(`/api/orders/${order.get('id')}/production-tickets`);
    this.downloadProductionTicketTemplate(order);
  }

  async invoiceDocument(invoice) {
    const resource = invoice.constructor.modelName == 'deposit-invoice' ? 'deposit-invoices' : 'invoices';
    await this._generate(`/api/${resource}/${invoice.get('id')}/documents`);
    this.downloadInvoiceDocument(invoice);
  }

  async certificateTemplate(invoice) {
    const resource = invoice.constructor.modelName == 'deposit-invoice' ? 'deposit-invoices' : 'invoices';
    await this._generate(`/api/${resource}/${invoice.get('id')}/certificates`);
    this.downloadCertificateTemplate(invoice);
  }

  // Document uploads

  uploadProductionTicket(model, file) {
    const { access_token } = this.get('session.data.authenticated');
    const resource = model.constructor.modelName == 'order' ? 'orders' : 'interventions';
    return file.upload(`/api/${resource}/${model.id}/production-ticket`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
  }

  uploadCertificate(invoice, file) {
    const { access_token } = this.get('session.data.authenticated');
    const resource = invoice.constructor.modelName == 'deposit-invoice' ? 'deposit-invoices' : 'invoices';
    return file.upload(`/api/${resource}/${invoice.id}/certificate`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
  }

  // Document removal

  deleteProductionTicket(model) {
    const { access_token } = this.get('session.data.authenticated');
    const resource = model.constructor.modelName == 'order' ? 'orders' : 'interventions';
    return fetch(`/api/${resource}/${model.id}/production-ticket`, {
      method: 'DELETE',
      headers: new Headers({
        Authorization: `Bearer ${access_token}`
      })
    });
  }

  deleteCertificate(invoice) {
    const { access_token } = this.get('session.data.authenticated');
    const resource = invoice.constructor.modelName == 'deposit-invoice' ? 'deposit-invoices' : 'invoices';
    return fetch(`/api/${resource}/${invoice.id}/certificate`, {
      method: 'DELETE',
      headers: new Headers({
        Authorization: `Bearer ${access_token}`
      })
    });
  }

  // Document downloads

  downloadVisitReport(request) {
    this._openInNewTab(`/api/files/requests/${request.get('id')}`);
  }

  downloadInterventionReport(intervention) {
    this._openInNewTab(`/api/files/interventions/${intervention.get('id')}`);
  }

  downloadOfferDocument(offer) {
    this._openInNewTab(`/api/files/offers/${offer.get('id')}`);
  }

  downloadOrderDocument(order) {
    this._openInNewTab(`/api/files/orders/${order.get('id')}`);
  }

  downloadDeliveryNote(order) {
    this._openInNewTab(`/api/files/delivery-notes/${order.get('id')}`);
  }

  downloadProductionTicketTemplate(order) {
    this._openInNewTab(`/api/files/production-ticket-templates/${order.get('id')}`);
  }

  downloadProductionTicket(order, options) {
    const defaultOptions = { watermark: false };
    const opts = Object.assign({}, defaultOptions, options);
    const query = Object.keys(opts).map(k => `${k}=${opts[k]}`).join('&');
    this._openInNewTab(`/api/files/production-tickets/${order.get('id')}?${query}`);
  }

  downloadInvoiceDocument(invoice) {
    const resource = invoice.constructor.modelName == 'deposit-invoice' ? 'deposit-invoices' : 'invoices';
    this._openInNewTab(`/api/files/${resource}/${invoice.get('id')}`);
  }

  downloadCertificateTemplate(invoice) {
    const resource = invoice.constructor.modelName == 'deposit-invoice' ? 'deposit-invoices' : 'invoices';
    this._openInNewTab(`/api/files/${resource}/${invoice.get('id')}/certificate-template`);
  }

  downloadCertificate(invoice) {
    const resource = invoice.constructor.modelName == 'deposit-invoice' ? 'deposit-invoices' : 'invoices';
    this._openInNewTab(`/api/files/${resource}/${invoice.get('id')}/certificate`);
  }

  // Core helpers
  async _generate(url) {
    const { access_token } = this.get('session.data.authenticated');
    const result = await fetch(url, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${access_token}`
      })
    });

    if (result.ok)
      return result;
    else
      throw result;
  }

  _openInNewTab(href) {
    Object.assign(document.createElement('a'), {
      target: '_blank',
      href,
    }).click();
  }
}
