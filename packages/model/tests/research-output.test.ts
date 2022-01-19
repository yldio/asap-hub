import { researchOutputMapSubtype } from '../src/research-output';

describe('Research Output Model', () => {
  it('should map deprecated subtype', () => {
    expect(researchOutputMapSubtype('Assays')).toEqual('Assay');
  });
});
