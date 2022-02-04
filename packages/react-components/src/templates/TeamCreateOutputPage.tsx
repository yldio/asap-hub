import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { contentSidePaddingWithNavigation } from '../layout';
import { TeamCreateOutputForm, TeamCreateOutputHeader } from '../organisms';
import { perRem } from '../pixels';

type TeamCreateOutputPageProps = ComponentProps<typeof TeamCreateOutputHeader> &
  ComponentProps<typeof TeamCreateOutputForm>;

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    48 / perRem
  }em `,
});

const TeamCreateOutputPage: React.FC<TeamCreateOutputPageProps> = ({
  type,
  onSave,
  tagSuggestions,
}) => (
  <>
    <TeamCreateOutputHeader type={type} />
    <main css={mainStyles}>
      <TeamCreateOutputForm onSave={onSave} tagSuggestions={tagSuggestions} />
    </main>
  </>
);

export default TeamCreateOutputPage;
