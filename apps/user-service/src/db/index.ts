import { MongoClient } from 'mongodb';
import Users from './users';
import Accounts from './accounts';

export class Db {
  users: Users;

  accounts: Accounts;

  constructor(client: MongoClient) {
    this.users = new Users(client.db().collection('users'));
    this.accounts = new Accounts(client.db().collection('accounts'));
  }
}
