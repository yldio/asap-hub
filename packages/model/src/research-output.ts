export interface ResearchOutput {
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
  createdBy: {
    id: string;
    name: string;
  };
}
