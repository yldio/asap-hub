import { mockLoadArticleOptions } from '../mock-milestones';

describe('mockLoadArticleOptions', () => {
  it('returns matching articles for a search term', async () => {
    const results = await mockLoadArticleOptions('alpha');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]!.label.toLowerCase()).toContain('alpha');
  });

  it('returns empty array when no match', async () => {
    const results = await mockLoadArticleOptions('zzzznonexistent');
    expect(results).toEqual([]);
  });

  it('returns all articles for empty search', async () => {
    const results = await mockLoadArticleOptions('');
    expect(results.length).toBeGreaterThan(0);
  });
});
