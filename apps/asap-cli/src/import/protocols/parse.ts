export interface Protocol {
  team: string;
  link: string;
  name: string;
  version: string;
  authors: string[];
  created: string;
  owner: string;
  keywords: string[];
  abstract: string;
}

export default (data: string[]): Protocol => {
  const [
    team,
    link,
    name,
    version,
    created,
    authors,
    keywords,
    owner,
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
    owner,
    keywords: keywords
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    abstract: abstract === '(private protocol)' ? '' : abstract,
  };
};
