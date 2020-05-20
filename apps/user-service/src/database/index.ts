import { MongoClient } from 'mongodb';
import Users from './users';

export class Db {
  users: Users;

  constructor(client: MongoClient) {
    this.users = new Users(client.db().collection('users'));
  }
}
