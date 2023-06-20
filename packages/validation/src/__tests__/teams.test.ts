import { TEAM_TOOL_URL } from '../teams';

it('validates the url protocol', () => {
  expect(TEAM_TOOL_URL.test('http://ww')).toBe(true);
  expect(TEAM_TOOL_URL.test('https://ww')).toBe(true);
  expect(TEAM_TOOL_URL.test('http:ww')).toBe(false);
  expect(TEAM_TOOL_URL.test('https:ww')).toBe(false);
  expect(TEAM_TOOL_URL.test('slack://tool')).toBe(false);
  expect(TEAM_TOOL_URL.test('www')).toBe(false);
});
