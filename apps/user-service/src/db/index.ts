import { MongoClient } from 'mongodb';
import Users from './users';
import Accounts from './accounts';

export class Db {
  users: Users;

  accounts: Accounts;

  constructor(connection: MongoClient) {
    this.users = new Users(connection.db().collection('users'));
    this.accounts = new Accounts(connection.db().collection('accounts'));
  }
}
