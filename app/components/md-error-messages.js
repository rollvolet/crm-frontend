import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

@tagName('')
export default class MdErrorMessages extends Component {
  errors = null;
}
