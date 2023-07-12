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
  const route =
    entityType === 'workingGroup'
      ? gp2.workingGroups({}).workingGroup({ workingGroupId: id })
      : gp2.projects({}).project({ projectId: id });
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
        href: route.createOutput({ outputDocumentType: 'article' }).$,
      }}
      {{
        item: <>{outputCodeSoftwareIcon} Code/Software</>,
        href: route.createOutput({
          outputDocumentType: 'code-software',
        }).$,
      }}
      {{
        item: <>{outputDatasetIcon} Dataset</>,
        href: route.createOutput({
          outputDocumentType: 'dataset',
        }).$,
      }}
      {{
        item: <>{outputFormIcon} Form</>,
        href: route.createOutput({
          outputDocumentType: 'procedural-form',
        }).$,
      }}
      {{
        item: <>{outputTrainingMarerialsIcon} Training Materials</>,
        href: route.createOutput({
          outputDocumentType: 'training-materials',
        }).$,
      }}
      {{
        item: <>{outputGP2ReportsIcon} GP2 Reports</>,
        href: route.createOutput({
          outputDocumentType: 'gp2-reports',
        }).$,
      }}
    </DropdownButton>
  );
};

export default ShareOutputButton;
