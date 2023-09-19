import Chance from 'chance';

const chance = new Chance();

export const createRandomOrcid = () =>
  [
    chance.string({ length: 4, numeric: true }),
    chance.string({ length: 4, numeric: true }),
    chance.string({ length: 4, numeric: true }),
    chance.string({ length: 3, numeric: true }),
  ].join('-') + chance.string({ length: 1, pool: '0123456789X' });
