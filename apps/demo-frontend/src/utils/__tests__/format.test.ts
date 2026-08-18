import type { Role } from '../../api/types';
import {
  folderCount,
  formatUploadedOn,
  roleLabel,
  videoCount,
} from '../format';

describe('formatUploadedOn', () => {
  it.each([
    ['2026-08-14T09:00:00.000Z', '14 Aug'],
    ['2026-01-01T23:59:59.000Z', '1 Jan'],
    ['2026-12-31T00:00:00.000Z', '31 Dec'],
  ])('formats %s as %s', (iso, expected) => {
    expect(formatUploadedOn(iso)).toBe(expected);
  });

  it.each(['', 'not-a-date'])('returns an empty string for %p', (input) => {
    expect(formatUploadedOn(input)).toBe('');
  });
});

describe('roleLabel', () => {
  it.each<[Role, string]>([
    ['admin', 'Admin'],
    ['creator', 'Creator'],
    ['member', 'Member'],
  ])('labels %s as %s', (role, expected) => {
    expect(roleLabel(role)).toBe(expected);
  });
});

describe('counts', () => {
  it.each([
    [0, '0 videos'],
    [1, '1 video'],
    [2, '2 videos'],
  ])('pluralises %i videos', (count, expected) => {
    expect(videoCount(count)).toBe(expected);
  });

  it.each([
    [0, '0 folders'],
    [1, '1 folder'],
    [5, '5 folders'],
  ])('pluralises %i folders', (count, expected) => {
    expect(folderCount(count)).toBe(expected);
  });
});
