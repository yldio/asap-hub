import { getCleanProjectTools } from '../../src/utils/project';

describe('getCleanProjectTools', () => {
  it('returns tools unchanged when all fields are non-empty', () => {
    const tools = [
      { name: 'Slack', url: 'https://slack.com', description: 'Team chat' },
    ];

    expect(getCleanProjectTools(tools)).toEqual(tools);
  });

  it('removes description when it is an empty string', () => {
    const tools = [{ name: 'Slack', url: 'https://slack.com', description: '' }];

    expect(getCleanProjectTools(tools)).toEqual([
      { name: 'Slack', url: 'https://slack.com' },
    ]);
  });

  it('removes description when it is whitespace only', () => {
    const tools = [{ name: 'Slack', url: 'https://slack.com', description: '   ' }];

    expect(getCleanProjectTools(tools)).toEqual([
      { name: 'Slack', url: 'https://slack.com' },
    ]);
  });

  it('keeps id when present', () => {
    const tools = [
      { id: 'tool-1', name: 'GitHub', url: 'https://github.com' },
    ];

    expect(getCleanProjectTools(tools)).toEqual(tools);
  });

  it('processes multiple tools independently', () => {
    const tools = [
      { name: 'Slack', url: 'https://slack.com', description: 'Chat' },
      { name: 'GitHub', url: 'https://github.com', description: '  ' },
    ];

    expect(getCleanProjectTools(tools)).toEqual([
      { name: 'Slack', url: 'https://slack.com', description: 'Chat' },
      { name: 'GitHub', url: 'https://github.com' },
    ]);
  });
});
