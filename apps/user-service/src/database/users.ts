import Base, { BaseModel } from './base';

export interface UserModel extends BaseModel {
  displayName: string;
  email: string;
}

export interface CreateUserModel {
  displayName: string;
  email: string;
}

export default class Users extends Base<UserModel> {
  async create(user: CreateUserModel): Promise<UserModel> {
    return super.insertOne(user);
  }

  async fetchByCode(code: string): Promise<UserModel> {
    const res = await this.collection.findOne({ 'invite.code': code });
    return res as UserModel;
  }

  async linkByCode(code: string, identity: string): Promise<UserModel> {
    const filter = { 'invite.code': code };
    const update = {
      $addToSet: {
        identities: identity,
      },
    };

    return super.findOneAndUpdate(filter, update);
  }
}
