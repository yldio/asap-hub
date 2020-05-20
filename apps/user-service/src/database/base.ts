import Boom from '@hapi/boom';
import { Collection, FilterQuery, ObjectId } from 'mongodb';

export interface BaseModel {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export default class Base<T> {
  collection: Collection;

  constructor(collection: Collection) {
    this.collection = collection;
  }

  async findOneAndUpdate(filter: FilterQuery<any>, update: any): Promise<T> {
    const res = await this.collection.findOneAndUpdate(filter, {
      ...update,
      $set: {
        ...update.$set,
        updatedAt: new Date(),
      },
    });

    // res.ok indicates the request was successful but we need to confirm
    // a document was found
    if (res.ok !== 1 || res.value === null) {
      throw Boom.forbidden();
    }

    return res.value as T;
  }

  async insertOne(docs: any): Promise<T> {
    const res = await this.collection.insertOne({
      ...docs,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (res.insertedCount !== 1) {
      throw Boom.badImplementation();
    }

    // the ops property is an array and we are only interested in the first
    // result
    const [created] = res.ops;
    return created as T;
  }
}
