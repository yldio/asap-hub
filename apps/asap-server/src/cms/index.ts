import Users from './users';
import { cms } from '../config';

export class CMS {
  users: Users;

  constructor() {
    this.users = new Users(cms);
  }
}
