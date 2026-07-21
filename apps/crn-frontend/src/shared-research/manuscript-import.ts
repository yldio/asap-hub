import {
  ManuscriptVersionResponse,
  ResearchOutputPublishingEntities,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { mapManuscriptVersionToResearchOutput } from './util';

export type ManuscriptImport =
  | {
      kind: 'create-imported-from-manuscript';
      manuscriptVersion: ManuscriptVersionResponse;
    }
  | {
      kind: 'add-version-from-manuscript';
      manuscriptVersion: ManuscriptVersionResponse;
      autoCreatedPreprintOutput: ResearchOutputResponse;
    };

export type ResolveResearchOutputParams = {
  existingOutput?: ResearchOutputResponse;
  manuscriptImport?: ManuscriptImport;
  latestManuscriptVersion?: ManuscriptVersionResponse;
  versionAction?: 'create' | 'edit';
  publishingEntity: ResearchOutputPublishingEntities;
};

export const resolveResearchOutput = ({
  existingOutput,
  manuscriptImport,
  latestManuscriptVersion,
  versionAction,
  publishingEntity,
}: ResolveResearchOutputParams): ResearchOutputResponse | undefined => {
  if (manuscriptImport?.kind === 'create-imported-from-manuscript') {
    return mapManuscriptVersionToResearchOutput(
      undefined,
      manuscriptImport.manuscriptVersion,
      publishingEntity,
    );
  }

  if (manuscriptImport?.kind === 'add-version-from-manuscript') {
    const { manuscriptVersion, autoCreatedPreprintOutput } = manuscriptImport;
    return {
      ...mapManuscriptVersionToResearchOutput(
        undefined,
        manuscriptVersion,
        publishingEntity,
      ),
      id: autoCreatedPreprintOutput.id,
      versions: [autoCreatedPreprintOutput],
    };
  }

  // New version of an output that tracks a manuscript (entered from the
  // output page). The parent gates rendering until the version is loaded.
  if (
    versionAction === 'create' &&
    existingOutput?.relatedManuscript &&
    latestManuscriptVersion
  ) {
    return mapManuscriptVersionToResearchOutput(
      { ...existingOutput, published: true },
      latestManuscriptVersion,
      publishingEntity,
    );
  }

  return existingOutput;
};

export type ManuscriptImportContext = {
  isNewManuscriptVersion: boolean;
  importedManuscriptVersion?: ManuscriptVersionResponse;
  isImportedFromManuscript: boolean;
};

export const resolveManuscriptImportContext = ({
  existingOutput,
  manuscriptImport,
  latestManuscriptVersion,
  versionAction,
  researchOutput,
}: Pick<
  ResolveResearchOutputParams,
  | 'existingOutput'
  | 'manuscriptImport'
  | 'latestManuscriptVersion'
  | 'versionAction'
> & {
  researchOutput?: ResearchOutputResponse;
}): ManuscriptImportContext => {
  const isNewManuscriptVersion =
    versionAction === 'create' && !!existingOutput?.relatedManuscript;

  const importedManuscriptVersion =
    manuscriptImport?.manuscriptVersion ??
    (isNewManuscriptVersion ? latestManuscriptVersion : undefined);

  return {
    isNewManuscriptVersion,
    importedManuscriptVersion,
    isImportedFromManuscript: Boolean(
      importedManuscriptVersion ||
        researchOutput?.relatedManuscriptVersion ||
        researchOutput?.relatedManuscript,
    ),
  };
};
