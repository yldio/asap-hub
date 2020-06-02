import { MongoClient } from 'mongodb';
import Users from './users';

export class Db {
  users: Users;

  constructor(connection: MongoClient) {
    this.users = new Users(connection.db().collection('users'));
  }
}
