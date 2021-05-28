export interface Protocol {
  team: string;
  link: string;
  name: string;
  version: string;
  authors: string[];
  created: string;
  owner: string;
  keywords: string[];
  abstract?: string;
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

  const [day, month, yearAndTime] = created.split('.');

  let abstractText;

  // try to parse string as JSON or fail gracefully
  try {
    abstractText = ['(private protocol)', 'Abstract crypted'].includes(abstract)
      ? undefined
      : JSON.parse(abstract)
          .blocks.reduce(
            (acc: string[], block: { text: string }) => acc.concat(block.text),
            [],
          )
          .join('\n');
  } catch (e) {
    abstractText = abstract;
  }

  return {
    team,
    link,
    name,
    version,
    authors: authors
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    created: [month, day, yearAndTime].join('-'),
    owner,
    keywords: keywords
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    abstract: abstractText,
  };
};
