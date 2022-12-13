import { css } from '@emotion/react';
import {
  ResearchOutputPublishingEntities,
  ResearchOutputResponse,
} from '@asap-hub/model';
import React, { ComponentProps } from 'react';
import { contentSidePaddingWithNavigation } from '../layout';
import { ResearchOutputForm, ResearchOutputHeader } from '../organisms';
import { perRem } from '../pixels';

type ResearchOutputPageProps = {
  researchOutputData?: ResearchOutputResponse;
  isEditMode?: boolean;
  publishingEntity?: ResearchOutputPublishingEntities;
} & ComponentProps<typeof ResearchOutputHeader> &
  ComponentProps<typeof ResearchOutputForm>;

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    48 / perRem
  }em `,
});

const ResearchOutputPage: React.FC<ResearchOutputPageProps> = ({
  documentType,
  researchOutputData,
  isEditMode,
  publishingEntity = 'Team',
  ...formProps
}) => (
  <>
    <ResearchOutputHeader
      documentType={documentType}
      publishingEntity={publishingEntity}
    />
    <main css={mainStyles}>
      <ResearchOutputForm
        {...formProps}
        documentType={documentType}
        researchOutputData={researchOutputData}
        isEditMode={isEditMode}
        publishingEntity={publishingEntity}
      />
    </main>
  </>
);

export default ResearchOutputPage;
