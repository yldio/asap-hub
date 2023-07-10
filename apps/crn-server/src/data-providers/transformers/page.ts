import { PageDataObject } from '@asap-hub/model';
import { GraphqlPage, RestPage } from '@asap-hub/squidex';

export const parsePage = (item: RestPage): PageDataObject => ({
  id: item.id,
  path: item.data.path.iv,
  title: item.data.title.iv,
  shortText: item.data.shortText?.iv || '',
  text: item.data.text?.iv || '',
  link: item.data.link?.iv,
  linkText: item.data.linkText?.iv,
});

export const parseGraphQLPage = (item: GraphqlPage): PageDataObject => ({
  id: item.id,
  path: item.flatData?.path || '',
  title: item.flatData?.title || '',
  shortText: item.flatData?.shortText || '',
  text: item.flatData?.text || '',
  link: item.flatData?.link || '',
  linkText: item.flatData?.linkText || '',
});
