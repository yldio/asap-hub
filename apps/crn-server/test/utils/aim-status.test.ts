import { deriveAimStatus } from '../../src/utils/aim-status';

describe('deriveAimStatus', () => {
  it('returns Pending when milestones is undefined', () => {
    expect(deriveAimStatus(undefined)).toBe('Pending');
  });

  it('returns Pending when milestones is empty', () => {
    expect(deriveAimStatus([])).toBe('Pending');
  });

  it('returns Pending when all milestones have no status', () => {
    expect(deriveAimStatus([{ status: null }, { status: undefined }])).toBe(
      'Pending',
    );
  });

  it('returns Pending when all milestones are Pending', () => {
    expect(
      deriveAimStatus([{ status: 'Pending' }, { status: 'Pending' }]),
    ).toBe('Pending');
  });

  it('returns Complete when all milestones are Complete', () => {
    expect(
      deriveAimStatus([{ status: 'Complete' }, { status: 'Complete' }]),
    ).toBe('Complete');
  });

  it('returns Terminated when all milestones are Terminated', () => {
    expect(
      deriveAimStatus([{ status: 'Terminated' }, { status: 'Terminated' }]),
    ).toBe('Terminated');
  });

  it('returns Complete when milestones are a mix of Complete and Terminated', () => {
    expect(
      deriveAimStatus([{ status: 'Complete' }, { status: 'Terminated' }]),
    ).toBe('Complete');
  });

  it('returns In Progress for any other mix', () => {
    expect(
      deriveAimStatus([{ status: 'In Progress' }, { status: 'Complete' }]),
    ).toBe('In Progress');
  });

  it('ignores null milestone entries', () => {
    expect(deriveAimStatus([null, { status: 'Complete' }])).toBe('Complete');
  });
});
