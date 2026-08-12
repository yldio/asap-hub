import { RESEARCH_OUTPUT_FLOW_IDS } from '@asap-hub/model';
import {
  createManuscriptVersionResponse,
  createResearchOutputResponse,
} from '@asap-hub/fixtures';
import {
  mapManuscriptVersionToResearchOutput,
  ResolveFlowIdParams,
  resolveResearchOutputFlowId,
  toResearchOutputVersion,
} from '../util';

describe('resolveResearchOutputFlowId', () => {
  const baseParams: ResolveFlowIdParams = {
    entityType: 'team',
    versionAction: undefined,
    published: false,
    isImportedFromManuscript: false,
    isDuplicate: false,
    hasResearchOutputId: false,
  };

  describe('team flows', () => {
    it('returns TEAM_DUPLICATE when duplicating', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'team',
          isDuplicate: true,
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.TEAM_DUPLICATE);
    });

    it('returns TEAM_ADD_VERSION when creating a version', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'team',
          versionAction: 'create',
          hasResearchOutputId: true,
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.TEAM_ADD_VERSION);
    });

    it('returns TEAM_ADD_VERSION_FROM_MANUSCRIPT when creating a version from a manuscript', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'team',
          versionAction: 'create',
          hasResearchOutputId: true,
          isImportedFromManuscript: true,
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.TEAM_ADD_VERSION_FROM_MANUSCRIPT);
    });

    it.each([
      [false, RESEARCH_OUTPUT_FLOW_IDS.TEAM_EDIT_DRAFT],
      [true, RESEARCH_OUTPUT_FLOW_IDS.TEAM_EDIT_PUBLISHED],
    ])('returns %s published edit flow', (published, expectedFlowId) => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'team',
          versionAction: 'edit',
          hasResearchOutputId: true,
          published,
        }),
      ).toBe(expectedFlowId);
    });

    it('returns TEAM_CREATE_IMPORTED_FROM_MANUSCRIPT when creating from manuscript', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'team',
          isImportedFromManuscript: true,
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.TEAM_CREATE_IMPORTED_FROM_MANUSCRIPT);
    });

    it('returns TEAM_CREATE_MANUAL by default', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'team',
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.TEAM_CREATE_MANUAL);
    });
  });

  describe('project flows', () => {
    it('returns PROJECT_DUPLICATE when duplicating', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'project',
          isDuplicate: true,
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.PROJECT_DUPLICATE);
    });

    it('returns PROJECT_ADD_VERSION when creating a version', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'project',
          versionAction: 'create',
          hasResearchOutputId: true,
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.PROJECT_ADD_VERSION);
    });

    it('returns PROJECT_ADD_VERSION_FROM_MANUSCRIPT when creating a version from a manuscript', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'project',
          versionAction: 'create',
          hasResearchOutputId: true,
          isImportedFromManuscript: true,
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.PROJECT_ADD_VERSION_FROM_MANUSCRIPT);
    });

    it.each([
      [false, RESEARCH_OUTPUT_FLOW_IDS.PROJECT_EDIT_DRAFT],
      [true, RESEARCH_OUTPUT_FLOW_IDS.PROJECT_EDIT_PUBLISHED],
    ])(
      'returns %s published project edit flow',
      (published, expectedFlowId) => {
        expect(
          resolveResearchOutputFlowId({
            ...baseParams,
            entityType: 'project',
            versionAction: 'edit',
            hasResearchOutputId: true,
            published,
          }),
        ).toBe(expectedFlowId);
      },
    );

    it('returns PROJECT_CREATE_IMPORTED_FROM_MANUSCRIPT when creating from manuscript', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'project',
          isImportedFromManuscript: true,
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.PROJECT_CREATE_IMPORTED_FROM_MANUSCRIPT);
    });

    it('returns PROJECT_CREATE_MANUAL by default', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'project',
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.PROJECT_CREATE_MANUAL);
    });
  });

  describe('working group flows', () => {
    it('returns WORKING_GROUP_DUPLICATE when duplicating', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'working-group',
          isDuplicate: true,
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_DUPLICATE);
    });

    it('returns WORKING_GROUP_ADD_VERSION when creating a version', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'working-group',
          versionAction: 'create',
          hasResearchOutputId: true,
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_ADD_VERSION);
    });

    it.each([
      [false, RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_EDIT_DRAFT],
      [true, RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_EDIT_PUBLISHED],
    ])(
      'returns %s published working group edit flow',
      (published, expectedFlowId) => {
        expect(
          resolveResearchOutputFlowId({
            ...baseParams,
            entityType: 'working-group',
            versionAction: 'edit',
            hasResearchOutputId: true,
            published,
          }),
        ).toBe(expectedFlowId);
      },
    );

    it('returns WORKING_GROUP_CREATE when imported from manuscript, as working groups have no manuscript flow', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'working-group',
          isImportedFromManuscript: true,
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_CREATE);
    });

    it('returns WORKING_GROUP_ADD_VERSION when creating a version imported from manuscript', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'working-group',
          versionAction: 'create',
          hasResearchOutputId: true,
          isImportedFromManuscript: true,
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_ADD_VERSION);
    });

    it('returns WORKING_GROUP_CREATE by default', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'working-group',
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_CREATE);
    });
  });

  describe('precedence', () => {
    it('prefers duplicate over all other conditions', () => {
      expect(
        resolveResearchOutputFlowId({
          ...baseParams,
          entityType: 'team',
          isDuplicate: true,
          versionAction: 'create',
          hasResearchOutputId: true,
          isImportedFromManuscript: true,
        }),
      ).toBe(RESEARCH_OUTPUT_FLOW_IDS.TEAM_DUPLICATE);
    });
  });
});

describe('mapManuscriptVersionToResearchOutput', () => {
  it('copies the preprint date over when lifecycle is Preprint', () => {
    const manuscriptVersion = createManuscriptVersionResponse({
      lifecycle: 'Preprint',
      preprintDate: '2023-01-02T00:00:00.000Z',
      publicationDate: '2024-05-06T00:00:00.000Z',
    });

    const output = mapManuscriptVersionToResearchOutput(
      undefined,
      manuscriptVersion,
      'Team',
    );

    expect(output.publishDate).toBe('2023-01-02T00:00:00.000Z');
  });

  it.each(['Publication', 'Publication with addendum or corrigendum'] as const)(
    'copies the publication date over when lifecycle is %s',
    (lifecycle) => {
      const manuscriptVersion = createManuscriptVersionResponse({
        lifecycle,
        preprintDate: '2023-01-02T00:00:00.000Z',
        publicationDate: '2024-05-06T00:00:00.000Z',
      });

      const output = mapManuscriptVersionToResearchOutput(
        undefined,
        manuscriptVersion,
        'Team',
      );

      expect(output.publishDate).toBe('2024-05-06T00:00:00.000Z');
    },
  );
});

describe('toResearchOutputVersion', () => {
  it('picks the version fields out of an output', () => {
    const output = {
      ...createResearchOutputResponse(),
      id: 'ro-1',
      title: 'An output',
      documentType: 'Protocol' as const,
      type: 'Preprint' as const,
      link: 'http://example.com',
      addedDate: '2024-05-06T00:00:00.000Z',
    };

    expect(toResearchOutputVersion(output)).toEqual({
      id: 'ro-1',
      title: 'An output',
      documentType: 'Protocol',
      type: 'Preprint',
      link: 'http://example.com',
      addedDate: '2024-05-06T00:00:00.000Z',
    });
  });

  it('falls back to an empty Article placeholder when there is no output yet', () => {
    expect(toResearchOutputVersion(undefined)).toEqual({
      id: '',
      title: '',
      documentType: 'Article',
      type: undefined,
      link: undefined,
      addedDate: undefined,
    });
  });
});
