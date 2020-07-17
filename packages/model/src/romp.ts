export interface Romp {
  id: string;
  created: string;
  url: string;
  doi: string;
  outputType: string;
  title: string;
  description: string;
  authors: [
    {
      name: string;
      id: string;
    },
  ];
  publishDate: string;
  createdBy: string;
}
