import { css } from '@emotion/react';
import { Divider, Headline5, NavigationLink } from '../atoms';
import { InterestGroupsIcon, TeamIcon, WorkingGroupsIcon } from '../icons';
import { rem } from '../pixels';

const dividerStyle = css({
  display: 'block',
  marginLeft: rem(12),
  marginRight: rem(12),
});

const headlineStyle = css({
  padding: `${rem(12)} ${rem(12)}`,
  display: 'block',
});

const listStyle = css({
  a: {
    paddingTop: rem(12),
    paddingBottom: rem(12),
    p: {
      span: {
        svg: {
          stroke: 'unset',
          strokeWidth: 0,
        },
      },
    },
  },
});

type UserNavigationAssociationSectionProps = {
  userOnboarded: boolean;
  association: ReadonlyArray<{
    name: string;
    href: string;
    active?: boolean;
    icon?: JSX.Element;
  }>;
  title:
    | 'MY TEAMS'
    | 'MY INTEREST GROUPS'
    | 'MY WORKING GROUPS'
    | 'MY PROJECTS';
};

const sectionIcon: Partial<
  Record<UserNavigationAssociationSectionProps['title'], JSX.Element>
> = {
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
      {association.map(
        ({ name, href, active = true, icon }) =>
          active && (
            <li css={listStyle} key={href}>
              <NavigationLink
                href={href}
                icon={icon ?? sectionIcon[title]}
                enabled={userOnboarded}
              >
                {name}
              </NavigationLink>
            </li>
          ),
      )}
    </div>
  </div>
);

export default UserNavigationAssociationSection;
