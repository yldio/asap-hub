import { createResearchOutputResponse } from '@asap-hub/fixtures';
import {
  ResearchOutputResponse,
  ResearchOutputIdentifierType,
} from '@asap-hub/model';
import {
  equals,
  getIdentifierType,
  isDirty,
  isIdentifierModified,
  ResearchOutputState,
  getPublishDate,
} from '../index';

describe('isDirty', () => {
  const researchOutputResponse: ResearchOutputResponse =
    createResearchOutputResponse();
  const payload: ResearchOutputState = {
    title: researchOutputResponse.title,
    description: researchOutputResponse.description,
    link: researchOutputResponse.link,
    type: researchOutputResponse.type!,
    tags: researchOutputResponse.tags,
    methods: researchOutputResponse.methods,
    organisms: researchOutputResponse.organisms,
    environments: researchOutputResponse.environments,
    teams: researchOutputResponse?.teams.map((element, index) => ({
      label: element.displayName,
      value: element.id,
      isFixed: index === 0,
    })),
    labs: researchOutputResponse?.labs.map((lab) => ({
      value: lab.id,
      label: lab.name,
    })),
    authors: researchOutputResponse?.authors.map((author) => ({
      value: author.id,
      label: author.displayName,
      user: author,
    })),
    subtype: researchOutputResponse.subtype,
    labCatalogNumber: researchOutputResponse.labCatalogNumber,
    identifierType: ResearchOutputIdentifierType.Empty,
  };

  it('returns true for edit mode when values differ from the initial ones', () => {
    expect(
      isDirty(payload, {
        ...researchOutputResponse,
        title: 'Changed title',
        doi: '12.1234',
      }),
    ).toBeTruthy();
  });

  it('returns false for edit mode when values equal the initial ones', () => {
    expect(isDirty(payload, researchOutputResponse)).toBeFalsy();
  });

  it('returns true when the initial values are changed', () => {
    expect(isDirty(payload)).toBeTruthy();
  });

  it('returns true when the initial values are unchanged', () => {
    expect(
      isDirty({
        title: '',
        description: '',
        link: '',
        type: '',
        tags: [],
        methods: [],
        organisms: [],
        environments: [],
        teams: [{ value: '12', label: 'Team ASAP' }],
        labs: [],
        authors: [],
        subtype: undefined,
        labCatalogNumber: '',
        identifier: '',
        identifierType: ResearchOutputIdentifierType.Empty,
      }),
    ).toBeFalsy();
  });

  it('returns false when the identifier is absent', () => {
    expect(isIdentifierModified(researchOutputResponse)).toBeFalsy();
  });

  it('returns false when the identifier is equal to initial identifier', () => {
    expect(
      isIdentifierModified(
        { ...researchOutputResponse, doi: '12.1234' },
        '12.1234',
      ),
    ).toBeFalsy();
  });

  it('returns true when the identifier is not equal to initial identifier', () => {
    expect(
      isIdentifierModified(
        { ...researchOutputResponse, doi: '12.1234' },
        '12.5555',
      ),
    ).toBeTruthy();
  });
});

describe('equals', () => {
  const testArray = ['Team ASAP', 'Team Chen', 'Team Allesi'];
  it('returns true when both array contain the same elements', () => {
    expect(equals(testArray, testArray.reverse())).toBeTruthy();
  });
  it('returns false when arrays differ', () => {
    expect(equals(testArray, testArray.slice(0, 1))).toBeFalsy();
  });
});

describe('getPublishDate', () => {
  const dateString = new Date().toString();
  it('returns a new date if date string exists', () => {
    expect(getPublishDate(dateString)).toBeInstanceOf(Date);
  });
  it('returns undefined if no date string is present', () => {
    expect(getPublishDate()).toBeUndefined();
  });
});

describe('getIdentifierType', () => {
  it('returns DOI when doi is present', () => {
    expect(
      getIdentifierType({ ...createResearchOutputResponse(), doi: 'abc' }),
    ).toEqual('DOI');
  });
  it('returns RRID when rrid is present', () => {
    expect(
      getIdentifierType({ ...createResearchOutputResponse(), rrid: 'abc' }),
    ).toEqual('RRID');
  });
  it('returns Accession Number when accession is present', () => {
    expect(
      getIdentifierType({
        ...createResearchOutputResponse(),
        accession: 'abc',
      }),
    ).toEqual('Accession Number');
  });
  it('returns empty when there is no identifier present', () => {
    expect(
      getIdentifierType({
        ...createResearchOutputResponse(),
        accession: '',
        rrid: '',
        doi: '',
      }),
    ).toEqual('');
  });
});
