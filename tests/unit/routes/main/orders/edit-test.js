import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | main/orders/edit', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:main/orders/edit');
    assert.ok(route);
  });
});
