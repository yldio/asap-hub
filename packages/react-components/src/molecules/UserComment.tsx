import { Message } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { FC } from 'react';

import { UserCommentHeader } from '.';

type UserCommentProps = Message;

const getUserHref = (id: string) =>
  network({}).users({}).user({ userId: id }).$;
const getTeams = (teams: Message['createdBy']['teams']) =>
  teams.map((team) => ({
    href: network({}).teams({}).team({ teamId: team.id }).$,
    name: team.name,
  }));

const UserComment: FC<UserCommentProps> = ({
  createdBy,
  createdDate,
  text,
}) => (
  <>
    <UserCommentHeader
      {...createdBy}
      userHref={getUserHref(createdBy.id)}
      teams={getTeams(createdBy.teams)}
      date={createdDate}
    />
    <span>{text}</span>
  </>
);
export default UserComment;
