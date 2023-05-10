import { NavigationLink, Paragraph } from '../atoms';
import { InterestGroupsIcon, TeamIcon, WorkingGroupsIcon } from '../icons';

type UserNavigationAssociationSectionProps = {
  teams: ReadonlyArray<{ name: string; href: string }>;
  workingGroups: ReadonlyArray<{ name: string; href: string; active: boolean }>;
  interestGroups: ReadonlyArray<{
    name: string;
    href: string;
    active: boolean;
  }>;
  userOnboarded: boolean;
};

const UserNavigationAssociationSection: React.FC<
  UserNavigationAssociationSectionProps
> = ({ teams, workingGroups, interestGroups, userOnboarded }) => (
  <div>
    {teams.length > 0 && (
      <div>
        <Paragraph>MY TEAMS</Paragraph>
        {teams.map(({ name, href }) => (
          <li key={href}>
            <NavigationLink
              href={href}
              icon={<TeamIcon />}
              enabled={userOnboarded}
            >
              {name}
            </NavigationLink>
          </li>
        ))}
      </div>
    )}
    {interestGroups.length > 0 && (
      <div>
        <Paragraph>MY INTEREST GROUPS</Paragraph>
        {interestGroups.map(
          ({ name, href, active }) =>
            active && (
              <li key={href}>
                <NavigationLink
                  href={href}
                  icon={<InterestGroupsIcon />}
                  enabled={userOnboarded}
                >
                  {name}
                </NavigationLink>
              </li>
            ),
        )}
      </div>
    )}
    {workingGroups.length > 0 && (
      <div>
        <Paragraph>MY WORKING GROUPS</Paragraph>
        {workingGroups.map(
          ({ name, href, active }) =>
            active && (
              <li key={href}>
                <NavigationLink
                  href={href}
                  icon={<WorkingGroupsIcon />}
                  enabled={userOnboarded}
                >
                  {name}
                </NavigationLink>
              </li>
            ),
        )}
      </div>
    )}
  </div>
);

export default UserNavigationAssociationSection;
