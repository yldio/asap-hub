import Base, { BaseModel } from './base';
import { UserModel } from './users';

export interface AccountModel extends BaseModel {
  user: UserModel;
}

export interface CreateAccountModel {
  _id: string;
  identity: string;
}

export default class Accounts extends Base<AccountModel> {
  async create(account: CreateAccountModel): Promise<AccountModel> {
    return super.insertOne(account);
  }

  async fetch(identifier: string): Promise<AccountModel> {
    return super.findOne({ _id: identifier });
  }
}
