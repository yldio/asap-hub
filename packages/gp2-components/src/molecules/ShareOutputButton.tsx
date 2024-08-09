import { DropdownButton, pixels, plusIcon } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { css } from '@emotion/react';
import outputArticleIcon from '../icons/output-article';
import outputCodeSoftwareIcon from '../icons/output-code-software';
import outputDatasetIcon from '../icons/output-dataset';
import outputFormIcon from '../icons/output-form';
import outputGP2ReportsIcon from '../icons/output-gp2-reports';
import outputTrainingMarerialsIcon from '../icons/output-training-materials';

type ShareOutputButtonProps = {
  entityType: 'workingGroup' | 'project';
  id: string;
};

const { rem } = pixels;

const buttonTextStyles = css({
  display: 'inline-flex',
  gap: rem(8),
  padding: `0 ${rem(16)} 0 ${rem(8)}`,
});

const ShareOutputButton: React.FC<ShareOutputButtonProps> = ({
  entityType,
  id,
}) => {
  const generateHref = (documentType: gp2.OutputDocumentTypeParameter) =>
    entityType === 'workingGroup'
      ? gp2.workingGroups.DEFAULT.DETAILS.CREATE_OUTPUT.buildPath({
          outputDocumentType: documentType,
          workingGroupId: id,
        })
      : gp2.projects.DEFAULT.DETAILS.CREATE_OUTPUT.buildPath({
          outputDocumentType: documentType,
          projectId: id,
        });

  return (
    <DropdownButton
      noMargin
      buttonChildren={() => (
        <span css={buttonTextStyles}>
          {plusIcon}
          Share an output
        </span>
      )}
    >
      {{
        item: <>{outputArticleIcon} Article</>,
        href: generateHref('article'),
      }}
      {{
        item: <>{outputCodeSoftwareIcon} Code/Software</>,
        href: generateHref('code-software'),
      }}
      {{
        item: <>{outputDatasetIcon} Dataset</>,
        href: generateHref('dataset'),
      }}
      {{
        item: <>{outputFormIcon} Form</>,
        href: generateHref('procedural-form'),
      }}
      {{
        item: <>{outputGP2ReportsIcon} GP2 Reports</>,
        href: generateHref('gp2-reports'),
      }}
      {{
        item: <>{outputTrainingMarerialsIcon} Training Materials</>,
        href: generateHref('training-materials'),
      }}
    </DropdownButton>
  );
};

export default ShareOutputButton;
