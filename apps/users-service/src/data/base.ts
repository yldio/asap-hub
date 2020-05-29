import go from 'apr-intercept';
import Boom from '@hapi/boom';
import { Collection, ObjectId } from 'mongodb';

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

  // async findOne(filter: FilterQuery<any>): Promise<T> {
  //   const [res] = await this.collection.find(filter).limit(1).toArray();
  //   if (res) {
  //     return res as T;
  //   }
  //   throw Boom.forbidden();
  // }

  // async findOneAndUpdate(filter: FilterQuery<any>, update: any): Promise<T> {
  //   const res = await this.collection.findOneAndUpdate(filter, {
  //     ...update,
  //     $set: {
  //       ...update.$set,
  //       updatedAt: new Date(),
  //     },
  //   });

  //   // res.ok indicates the request was successful but we need to confirm
  //   // a document was found
  //   if (res.ok !== 1 || res.value === null) {
  //     throw Boom.forbidden();
  //   }

  //   return res.value as T;
  // }

  async insertOne(docs: object): Promise<T> {
    const [err, res] = await go(
      this.collection.insertOne({
        ...docs,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    if (err) {
      // istanbul ignore else
      if (err.code === 11000) {
        throw Boom.forbidden('Forbidden', {
          error: err,
        });
      }
      // an error from mongo, just rethrow 🤞
      // istanbul ignore next
      throw err;
    }

    // mongo throws when it can insert a document, not throwing and not inserting
    // is a strange condition
    // istanbul ignore if
    if (res.insertedCount !== 1) {
      throw Boom.internal();
    }

    // the ops property is an array and we are only interested in the first document
    const [created] = res.ops;
    return created as T;
  }
}
