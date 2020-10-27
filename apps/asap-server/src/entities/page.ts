import { PageResponse } from '@asap-hub/model';

export interface CMSPage {
  id: string;
  data: {
    path: {
      iv: string;
    };
    title: {
      iv: string;
    };
    shortText: {
      iv: string;
    };
    text: { iv: string };
    link?: { iv: string };
    linkText?: { iv: string };
  };
}

export interface CMSGraphQLPage {
  id: string;
  flatData: {
    path: string;
    title: string;
    shortText?: string;
    text: string;
    link?: string;
    linkText?: string;
  };
}

export const parsePage = (item: CMSPage): PageResponse => {
  return {
    id: item.id,
    path: item.data.path.iv,
    title: item.data.title.iv,
    shortText: item.data.shortText?.iv,
    text: item.data.text?.iv || '',
    link: item.data.link?.iv,
    linkText: item.data.linkText?.iv,
  };
};

export const parseGraphQLPage = (item: CMSGraphQLPage): PageResponse => {
  return {
    id: item.id,
    ...item.flatData,
    shortText: item.flatData.shortText || '',
    text: item.flatData.text || '',
  };
};
