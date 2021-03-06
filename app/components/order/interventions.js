import Component from '@glimmer/component';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import updateContactAndBuildingRequest from '../../utils/api/update-contact-and-building';

export default class OrderInterventionsComponent extends Component {
  @service case
  @service currentSession
  @service store
  @service router

  @task
  *createNew() {
    const customer = this.case.current.customer;
    const employee = yield this.currentSession.getCurrentEmployee();
    const intervention = this.store.createRecord('intervention', {
      date: new Date(),
      origin: this.args.order,
      customer,
      employee
    });

    yield intervention.save();

    const body = {
      contactId: this.case.current.contact && this.case.current.contact.id,
      buildingId: this.case.current.building && this.case.current.building.id,
      interventionId: intervention.id
    };
    yield updateContactAndBuildingRequest(body);

    this.router.transitionTo('main.interventions.edit', intervention.id, {
      queryParams: { editMode: true }
    });
  }
}
