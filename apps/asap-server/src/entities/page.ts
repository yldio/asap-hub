import { PageResponse } from '@asap-hub/model';

export interface CMSPage {
  id: string;
  data: {
    title: {
      iv: string;
    };
    path: {
      iv: string;
    };
    text: { iv: string };
  };
}

export const parse = (obj: CMSPage): PageResponse => {
  return {
    path: obj.data.path.iv,
    text: obj.data.text?.iv || '',
    title: obj.data.title.iv,
  };
};
