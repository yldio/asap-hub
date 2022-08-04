import { ComponentProps } from 'react';

import { Card, Headline2, Link } from '../atoms';
import { MembersList } from '../molecules';

type LinkProp =
  | { readonly href: string; readonly hrefText: string }
  | { readonly href?: undefined; readonly hrefText?: undefined };

type TeamMembersSectionProps = LinkProp & {
  readonly title?: string;
  readonly members: ReadonlyArray<
    Omit<ComponentProps<typeof MembersList>['members'][0], 'teams'>
  >;
};

const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({
  members,
  title = `Team Members (${members.length})`,
  href,
  hrefText,
}) => (
  <Card>
    <Headline2 styleAsHeading={3}>{title}</Headline2>
    <MembersList members={members} />
    {href && (
      <Link buttonStyle small primary href={href}>
        {hrefText}
      </Link>
    )}
  </Card>
);

export default TeamMembersSection;
