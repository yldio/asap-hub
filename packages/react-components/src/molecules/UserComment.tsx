import { Message } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { FC } from 'react';

import { UserCommentHeader } from '.';
import { colors } from '..';
import { TextEditor } from '../atoms';
import { rem } from '../pixels';

type UserCommentProps = Message;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(8),
});

const replyStyles = css({
  'div > p': { marginTop: 0 },
});

const textEditorStyles = css({
  fontSize: rem(17),
  fontWeight: 400,
  lineHeight: rem(24),
  color: colors.neutral900.rgb,
});
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
  <div css={containerStyles}>
    <UserCommentHeader
      {...createdBy}
      userHref={getUserHref(createdBy.id)}
      teams={getTeams(createdBy.teams)}
      date={createdDate}
    />
    <div css={replyStyles}>
      <TextEditor
        id={`discussion-${createdBy.id}-${createdDate}`}
        value={text}
        enabled={false}
        isMarkdown
        editorStyles={textEditorStyles}
      />
    </div>
  </div>
);
export default UserComment;
