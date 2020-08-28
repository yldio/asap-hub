import { Squidex } from '@asap-hub/services-common';
import { PageResponse } from '@asap-hub/model';
import { CMSPage } from '../entities/page';

const deserialize = (obj: CMSPage): PageResponse => {
  return {
    path: obj.data.path.iv,
    text: obj.data.text.iv,
    title: obj.data.title.iv,
  };
};

export default class Users {
  pages: Squidex<CMSPage>;

  constructor() {
    this.pages = new Squidex('pages');
  }

  async fetchByPath(path: string): Promise<PageResponse> {
    const page = await this.pages.fetchOne({
      filter: { path: 'data.path.iv', op: 'eq', value: path },
    });
    return deserialize(page);
  }
}
