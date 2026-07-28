import { manuscriptIdFromVersionRecordId } from '@asap-hub/model';
import {
  ManuscriptOutputSelection,
  ManuscriptVersionOption,
} from '@asap-hub/react-components';
import { InnerToastContext } from '@asap-hub/react-context';
import { sharedResearch } from '@asap-hub/routing';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  useManuscriptVersionSuggestions,
  usePostPreprintResearchOutput,
} from '../network/teams/state';
import { decideManuscriptImport, ManuscriptImport } from './manuscript-import';

type ManuscriptOutputSelectionScreenProps = {
  teamId: string;
  onCreateManually: () => void;
  onManuscriptImported: (manuscriptImport: ManuscriptImport) => void;
};

/**
 * First phase of sharing an Article output: choose between creating it
 * manually or importing a manuscript. Importing a manuscript that already
 * has a publication makes the backend auto-create the preprint output, so
 * the form that follows adds the publication as a new version of it.
 */
const ManuscriptOutputSelectionScreen: React.FC<
  ManuscriptOutputSelectionScreenProps
> = ({ teamId, onCreateManually, onManuscriptImported }) => {
  const [manuscriptOutputSelection, setManuscriptOutputSelection] = useState<
    'manually' | 'import' | ''
  >('');
  const [selectedVersion, setSelectedVersion] =
    useState<ManuscriptVersionOption>();
  const [isImportingManuscript, setIsImportingManuscript] = useState(false);

  const navigate = useNavigate();
  const toast = useContext(InnerToastContext);
  const createPreprintResearchOutput = usePostPreprintResearchOutput();
  const getManuscriptVersionSuggestions = useManuscriptVersionSuggestions();

  const handleImportManuscript = async () => {
    const manuscriptVersion = selectedVersion?.version;
    if (!manuscriptVersion) {
      return;
    }

    const decision = decideManuscriptImport(manuscriptVersion);

    switch (decision.action) {
      case 'redirect-to-add-version':
        void navigate(
          sharedResearch({})
            .researchOutput({ researchOutputId: decision.researchOutputId })
            .versionResearchOutput({}).$,
        );
        return;

      case 'create-output':
        onManuscriptImported({ kind: 'new-output', manuscriptVersion });
        return;

      case 'create-preprint-then-add-version':
      default:
        setIsImportingManuscript(true);
        try {
          const preprintOutput = await createPreprintResearchOutput(
            manuscriptIdFromVersionRecordId(manuscriptVersion.id),
          );

          onManuscriptImported({
            kind: 'new-version',
            manuscriptVersion,
            preprintOutput,
          });
        } catch (error) {
          toast('An error has occurred. Please try again later.');
        } finally {
          setIsImportingManuscript(false);
        }
    }
  };

  return (
    <ManuscriptOutputSelection
      isImportingManuscript={isImportingManuscript}
      manuscriptOutputSelection={manuscriptOutputSelection}
      onChangeManuscriptOutputSelection={setManuscriptOutputSelection}
      onSelectCreateManually={onCreateManually}
      selectedVersion={selectedVersion}
      setSelectedVersion={setSelectedVersion}
      onImportManuscript={handleImportManuscript}
      getManuscriptVersionOptions={(input) =>
        getManuscriptVersionSuggestions(input, teamId).then(
          (versionSuggestions) =>
            versionSuggestions.map((version) => ({
              version,
              label: version.title,
              value: version.id,
            })),
        )
      }
    />
  );
};

export default ManuscriptOutputSelectionScreen;
