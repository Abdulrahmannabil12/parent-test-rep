import { Base } from "shared/model/base.model";


export class UserModel extends Base {
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  constructor() {
    super();
    this.email='';
    this.first_name = '';
    this.last_name = '';
    this.avatar = '';
  }
}

