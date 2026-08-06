import {
  createManuscriptVersionResponse,
  createResearchOutputResponse,
} from '@asap-hub/fixtures';
import { ResearchOutputResponse } from '@asap-hub/model';
import {
  decideManuscriptImport,
  isAddingVersionOfManuscriptOutput,
  resolveManuscriptOutputState,
} from '../manuscript-import';

const researchOutput = (
  overrides: Partial<ResearchOutputResponse> = {},
): ResearchOutputResponse => ({
  ...createResearchOutputResponse(),
  ...overrides,
});

describe('decideManuscriptImport', () => {
  it('redirects to the existing output when the version is already linked to one', () => {
    const version = createManuscriptVersionResponse({
      researchOutputId: 'ro-1',
      lifecycle: 'Publication',
    });

    expect(decideManuscriptImport(version)).toEqual({
      action: 'redirect-to-add-version',
      researchOutputId: 'ro-1',
    });
  });

  it('creates a brand new output for an unlinked preprint', () => {
    const version = createManuscriptVersionResponse({
      researchOutputId: undefined,
      lifecycle: 'Preprint',
    });

    expect(decideManuscriptImport(version)).toEqual({
      action: 'create-output',
    });
  });

  it('lets the backend create the preprint for an unlinked publication', () => {
    const version = createManuscriptVersionResponse({
      researchOutputId: undefined,
      lifecycle: 'Publication',
    });

    expect(decideManuscriptImport(version)).toEqual({
      action: 'create-preprint-then-add-version',
    });
  });
});

describe('isAddingVersionOfManuscriptOutput', () => {
  it.each([
    ['create' as const, 'manuscript-1', true],
    ['create' as const, undefined, false],
    ['edit' as const, 'manuscript-1', false],
    [undefined, 'manuscript-1', false],
  ])(
    'returns %s/%s -> %s for version action and related manuscript',
    (versionAction, relatedManuscript, expected) => {
      expect(
        isAddingVersionOfManuscriptOutput({
          versionAction,
          existingOutput: researchOutput({ relatedManuscript }),
        }),
      ).toBe(expected);
    },
  );

  it('returns false when there is no existing output', () => {
    expect(
      isAddingVersionOfManuscriptOutput({
        versionAction: 'create',
        existingOutput: undefined,
      }),
    ).toBe(false);
  });
});

describe('resolveManuscriptOutputState', () => {
  const manuscriptVersion = createManuscriptVersionResponse({
    title: 'Imported manuscript',
    url: 'http://example.com/imported',
  });

  describe('importing a manuscript as a new output', () => {
    it('maps the manuscript version onto a fresh output with no version action', () => {
      const state = resolveManuscriptOutputState({
        manuscriptImport: { kind: 'new-output', manuscriptVersion },
        publishingEntity: 'Team',
      });

      expect(state).toEqual(
        expect.objectContaining({
          importedVersion: manuscriptVersion,
          isImportedFromManuscript: true,
          versionAction: undefined,
        }),
      );
      expect(state.researchOutput).toEqual(
        expect.objectContaining({
          id: '',
          title: 'Imported manuscript',
          link: 'http://example.com/imported',
          published: false,
          versions: [],
        }),
      );
    });

    it('ignores the existing output and the incoming version action', () => {
      const state = resolveManuscriptOutputState({
        existingOutput: researchOutput({ id: 'ro-1', title: 'Existing' }),
        manuscriptImport: { kind: 'new-output', manuscriptVersion },
        versionAction: 'edit',
        publishingEntity: 'Team',
      });

      expect(state.researchOutput).toEqual(
        expect.objectContaining({ id: '', title: 'Imported manuscript' }),
      );
      expect(state.versionAction).toBeUndefined();
    });
  });

  it('when auto creates a preprint, adopts the preprint id and lists it as the first version', () => {
    const preprintOutput = researchOutput({ id: 'preprint-1' });

    const state = resolveManuscriptOutputState({
      manuscriptImport: {
        kind: 'new-version',
        manuscriptVersion,
        preprintOutput,
      },
      publishingEntity: 'Team',
    });

    expect(state).toEqual(
      expect.objectContaining({
        importedVersion: manuscriptVersion,
        isImportedFromManuscript: true,
        versionAction: 'create',
      }),
    );
    expect(state.researchOutput).toEqual(
      expect.objectContaining({
        id: 'preprint-1',
        title: 'Imported manuscript',
        versions: [preprintOutput],
      }),
    );
  });

  describe('adding a version to an output that tracks a manuscript', () => {
    const existingOutput = researchOutput({
      id: 'ro-1',
      title: 'Existing',
      published: false,
      relatedManuscript: 'manuscript-1',
    });

    it('maps the latest manuscript version onto the published existing output', () => {
      const latestManuscriptVersion = createManuscriptVersionResponse({
        title: 'Latest manuscript',
      });

      const state = resolveManuscriptOutputState({
        existingOutput,
        latestManuscriptVersion,
        versionAction: 'create',
        publishingEntity: 'Team',
      });

      expect(state).toEqual(
        expect.objectContaining({
          importedVersion: latestManuscriptVersion,
          isImportedFromManuscript: true,
          versionAction: 'create',
        }),
      );
      expect(state.researchOutput).toEqual(
        expect.objectContaining({
          id: 'ro-1',
          title: 'Latest manuscript',
          published: true,
        }),
      );
    });

    it('has no output to render until the latest manuscript version arrives', () => {
      const state = resolveManuscriptOutputState({
        existingOutput,
        latestManuscriptVersion: undefined,
        versionAction: 'create',
        publishingEntity: 'Team',
      });

      expect(state.researchOutput).toBeUndefined();
      expect(state.importedVersion).toBeUndefined();
      expect(state.versionAction).toBe('create');
    });
  });

  describe('without a manuscript import', () => {
    it('passes the existing output and version action straight through', () => {
      const existingOutput = researchOutput({ id: 'ro-1' });

      expect(
        resolveManuscriptOutputState({
          existingOutput,
          versionAction: 'edit',
          publishingEntity: 'Team',
        }),
      ).toEqual({
        researchOutput: existingOutput,
        importedVersion: undefined,
        isImportedFromManuscript: false,
        versionAction: 'edit',
      });
    });

    it.each<Partial<ResearchOutputResponse>>([
      { relatedManuscript: 'manuscript-1' },
      { relatedManuscriptVersion: 'version-1' },
    ])(
      'still flags the output as imported from a manuscript given %p',
      (manuscriptLink) => {
        expect(
          resolveManuscriptOutputState({
            existingOutput: researchOutput(manuscriptLink),
            versionAction: 'edit',
            publishingEntity: 'Team',
          }).isImportedFromManuscript,
        ).toBe(true);
      },
    );

    it('reports a brand new output as not imported', () => {
      expect(
        resolveManuscriptOutputState({ publishingEntity: 'Team' }),
      ).toEqual({
        researchOutput: undefined,
        importedVersion: undefined,
        isImportedFromManuscript: false,
        versionAction: undefined,
      });
    });
  });
});
