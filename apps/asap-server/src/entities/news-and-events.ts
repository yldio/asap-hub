export interface CMSNewsAndEvents {
  id: string;
  created: string;
  data: {
    type: {
      iv: 'News' | 'Event';
    };
    title: { iv: string };
    subtitle: { iv: string };
    thumbnail: { iv: string[] };
    text: { iv: string };
  };
}
