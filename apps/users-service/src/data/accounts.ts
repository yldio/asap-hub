import { ObjectId } from 'mongodb';
import Base, { BaseModel } from './base';

export interface AccountModel extends BaseModel {
  user: ObjectId;
}

export interface CreateAccountModel {
  user: ObjectId;
  identity: string;
}

export default class Accounts extends Base<AccountModel> {
  async create(account: CreateAccountModel): Promise<AccountModel> {
    return super.insertOne({
      _id: account.identity,
      user: account.user,
    });
  }

  // async fetch(identifier: string): Promise<AccountModel> {
  //   return super.findOne({ _id: identifier });
  // }
}
