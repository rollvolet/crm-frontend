import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class EditController extends Controller {
  @service case

  queryParams = ['editMode']
  editMode = false
}
