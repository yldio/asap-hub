export interface Protocol {
  team: string;
  link: string;
  name: string;
  version: string;
  authors: string[];
  created: string;
  contact: string;
  keywords: string[];
  abstract: string;
}

export default (data: string[]): Protocol => {
  const [
    team,
    link,
    name,
    version,
    authors,
    created,
    contact,
    keywords,
    abstract,
  ] = data.map((s) => s.trim());

  return {
    team,
    link,
    name,
    version,
    authors: authors
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    created,
    contact,
    keywords: keywords
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    abstract: abstract === '(private protocol)' ? '' : abstract,
  };
};
