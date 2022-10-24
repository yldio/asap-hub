export type Resource = {
  title: string;
  description?: string;
} & (
  | {
      type: 'Link';
      externalLink: string;
    }
  | {
      type: 'Note';
    }
);
