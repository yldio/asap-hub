import { PageDataObject } from '@asap-hub/model';
import { RestPage } from '@asap-hub/squidex';

export const parsePage = (item: RestPage): PageDataObject => ({
  id: item.id,
  path: item.data.path.iv,
  title: item.data.title.iv,
  shortText: item.data.shortText?.iv || '',
  text: item.data.text?.iv || '',
  link: item.data.link?.iv,
  linkText: item.data.linkText?.iv,
});
