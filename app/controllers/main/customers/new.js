import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    close() {
      this.transitionToRoute('main.customers.index');
    }
  }
});
