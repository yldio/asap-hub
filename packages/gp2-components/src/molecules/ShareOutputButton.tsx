import { DropdownButton, pixels, plusIcon } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { css } from '@emotion/react';

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
        item: <>Article</>,
        href: route.createOutput({ outputDocumentType: 'article' }).$,
      }}
      {{
        item: <>Code/Software</>,
        href: route.createOutput({
          outputDocumentType: 'code-software',
        }).$,
      }}
      {{
        item: <>Data Release</>,
        href: route.createOutput({
          outputDocumentType: 'data-release',
        }).$,
      }}
      {{
        item: <>Form</>,
        href: route.createOutput({
          outputDocumentType: 'form',
        }).$,
      }}
      {{
        item: <>Training Materials</>,
        href: route.createOutput({
          outputDocumentType: 'training-materials',
        }).$,
      }}
      {{
        item: <>Update</>,
        href: route.createOutput({
          outputDocumentType: 'update',
        }).$,
      }}
    </DropdownButton>
  );
};

export default ShareOutputButton;
