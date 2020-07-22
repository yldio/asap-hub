import Users from './users';
import Teams from './teams';

import { cms } from '../config';

export class CMS {
  users: Users;

  teams: Teams;

  constructor() {
    this.users = new Users(cms);
    this.teams = new Teams(cms);
  }
}
