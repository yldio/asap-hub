import { css } from '@emotion/react';
import { Divider, Headline5, NavigationLink } from '../atoms';
import { InterestGroupsIcon, TeamIcon, WorkingGroupsIcon } from '../icons';
import { perRem } from '../pixels';

const dividerStyle = css({
  display: 'block',
  marginLeft: `${12 / perRem}em`,
  marginRight: `${12 / perRem}em`,
});

const headlineStyle = css({
  padding: `${12 / perRem}em ${12 / perRem}em`,
  display: 'block',
});

const listStyle = css({
  a: {
    paddingTop: `${12 / perRem}em`,
    paddingBottom: `${12 / perRem}em`,
    p: {
      span: {
        svg: {
          stroke: 'unset',
        },
      },
    },
  },
});

type UserNavigationAssociationSectionProps = {
  userOnboarded: boolean;
  association: ReadonlyArray<{ name: string; href: string; active?: boolean }>;
  title: 'MY TEAMS' | 'MY INTEREST GROUPS' | 'MY WORKING GROUPS';
};

const icon = {
  'MY TEAMS': <TeamIcon />,
  'MY INTEREST GROUPS': <InterestGroupsIcon />,
  'MY WORKING GROUPS': <WorkingGroupsIcon />,
};

const UserNavigationAssociationSection: React.FC<
  UserNavigationAssociationSectionProps
> = ({ userOnboarded, association, title }) => (
  <div>
    <span css={dividerStyle}>
      <Divider />
    </span>
    <div>
      <span css={headlineStyle}>
        <Headline5 noMargin>{title}</Headline5>
      </span>
      {association.map(({ name, href, active = true }) => (
        <li css={listStyle} key={href}>
          <NavigationLink
            href={href}
            icon={icon[title]}
            enabled={userOnboarded && active}
          >
            {name}
          </NavigationLink>
        </li>
      ))}
    </div>
  </div>
);

export default UserNavigationAssociationSection;
