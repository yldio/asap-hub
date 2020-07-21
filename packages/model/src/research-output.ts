export interface ResearchOutput {
  id: string;
  created: string;
  url: string;
  doi: string;
  outputType: string;
  title: string;
  description: string;
  accessLevel: string;
  authors: [
    {
      displayName: string;
      id: string;
    },
  ];
  publishDate: string;
  createdBy: {
    id: string;
    displayName: string;
  };
}
