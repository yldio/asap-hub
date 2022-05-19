import { css } from '@emotion/react';
import { ResearchOutputResponse } from '@asap-hub/model';
import React, { ComponentProps } from 'react';
import { contentSidePaddingWithNavigation } from '../layout';
import { ResearchOutputForm, ResearchOutputHeader } from '../organisms';
import { perRem } from '../pixels';

type ResearchOutputPageProps = {
  researchOutputData?: ResearchOutputResponse;
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
  ...formProps
}) => (
  <>
    <ResearchOutputHeader documentType={documentType} />
    <main css={mainStyles}>
      <ResearchOutputForm
        {...formProps}
        documentType={documentType}
        researchOutputData={researchOutputData}
      />
    </main>
  </>
);

export default ResearchOutputPage;
