import { css } from '@emotion/react';

import { Display, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { steel, paper } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';
import { ResearchOutputType } from '@asap-hub/model';

const visualHeaderStyles = css({
  marginBottom: `${30 / perRem}em`,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    48 / perRem
  }em `,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});

const textStyles = css({
  maxWidth: `${720 / perRem}em`,
});

type TeamCreateOutputPageProps = { researchOutputType: ResearchOutputType };

const TeamCreateOutputHeader: React.FC<TeamCreateOutputPageProps> = ({
  researchOutputType,
}) => (
  <header>
    <div css={visualHeaderStyles}>
      <Display styleAsHeading={2}>
        Share {researchOutputType.toLowerCase()}
      </Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          Add your {researchOutputType.toLowerCase()} code to your third party
          publication platform (e.g. Github) before sharing on the hub.
        </Paragraph>
      </div>
    </div>
  </header>
);

// const TeamCreateOutputForm: React.FC = () => (
//   <Button onClick={onGoBack}>Back</Button>
// );

const TeamCreateOutputPage: React.FC<TeamCreateOutputPageProps> = ({
  researchOutputType,
}) => <TeamCreateOutputHeader researchOutputType={researchOutputType} />;

export default TeamCreateOutputPage;
