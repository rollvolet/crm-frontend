import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { warn } from '@ember/debug';

export default class InputFieldAddressInputComponent extends Component {
  @tracked value

  constructor() {
    super(...arguments);
    this.updateValue([this.args.address1, this.args.address2, this.args.address3]);
  }

  get size() {
    return this.args.size || 'xxlarge';
  }

  get label() {
    return this.args.label || 'Straat';
  }

  get errors() {
    const errors = [];
    const lines = (this.value || '').split('\n');
    if (lines.length > 3)
      errors.pushObject("Adres mag maximaal 3 lijnen bevatten. Enkel de 3 eerste lijnen zijn opgeslagen");
    return errors;
  }

  updateValue(lines) {
    let value = '';
    let i = 0;
    while(i < 3) {
      if (lines[i]) {
        value += lines[i];
        value += '\n';
      }
      i++;
    }
    this.value = value.replace(/[\s\uFEFF\xA0]+$/g, ''); // remove trailing newlines;
  }

  @action
  blur() {
    const lines = (this.value || '').split('\n');
    if (lines.length > 3)
      warn('Only 3 lines are allowed in the address text area', { id: 'input.too-many-address-lines' });

    const formatAddressLine = function (line) {
      if (line && line.length) {
        return line.charAt(0).toUpperCase() + line.slice(1); // upcase first letter
      } else {
        return undefined;
      }
    };

    const formattedLines = lines.map(l => formatAddressLine(l));
    this.updateValue(formattedLines);
    this.args.onBlur(formattedLines);
  }
}
