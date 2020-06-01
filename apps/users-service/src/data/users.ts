import Base, { BaseModel } from './base';

export interface UserModel extends BaseModel {
  displayName: string;
  email: string;
}

export interface CreateUserModel {
  displayName: string;
  email: string;
  invite?: {
    code: string;
    source: 'manual';
    createdAt: Date;
  };
}

export default class Users extends Base<UserModel> {
  async create(user: CreateUserModel): Promise<UserModel> {
    return super.insertOne(user);
  }

  async fetchByCode(code: string): Promise<UserModel> {
    const res = await this.collection.findOne({ 'invite.code': code });
    return res as UserModel;
  }
}
