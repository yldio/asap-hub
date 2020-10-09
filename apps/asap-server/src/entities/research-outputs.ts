export interface CMSResearchOutput {
  id: string;
  created: string;
  data: {
    url: { iv: string };
    doi: { iv: string };
    type: { iv: 'proposal' };
    title: { iv: string };
    text: { iv: string };
    publishDate: { iv: string };
  };
}
