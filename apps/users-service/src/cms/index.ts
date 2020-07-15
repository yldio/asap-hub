import Users from './users';
import Romps from './romps';

import { cms } from '../config';

export class CMS {
  users: Users;

  romps: Romps;

  constructor() {
    this.users = new Users(cms);
    this.romps = new Romps(cms);
  }
}
