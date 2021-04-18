import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class InputFieldCheckboxComponent extends Component {
  @tracked checkValue;

  constructor() {
    super(...arguments);
    this.checkedValue = this.isOn;
  }

  get onValue() {
    return true;
  }

  get offValue() {
    return false;
  }

  get isOn() {
    return this.args.value == this.onValue;
  }

  get isOff() {
    return !this.isOn;
  }

  @action
  toggleValue(event) {
    const newValue = event.target.checked ? this.onValue : this.offValue;
    this.args.onChange(newValue);
  }
}
