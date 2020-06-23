import Users from './users';

export class CMS {
  users: Users;

  constructor() {
    this.users = new Users();
  }
}
