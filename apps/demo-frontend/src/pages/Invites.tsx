/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, FormEvent, useState } from 'react';

import { useCreateInvite, useInvites } from '../api/hooks';
import type { Role } from '../api/types';
import { useIsAdmin, useIsCreator } from '../auth/MeContext';
import { Badge, Button, Card, Headline, Spinner } from '../ui/components';
import { charcoal, ember, lead, rem, silver, steel } from '../ui/theme';
import { roleLabel } from '../utils/format';
import { formatRecordedAt } from '../utils/time';

const formStyles = css({
  padding: rem(24),
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: rem(12),
});

const fieldStyles = css({
  display: 'grid',
  gap: rem(4),
  flexGrow: 1,
  minWidth: rem(200),
});

const labelStyles = css({
  fontSize: rem(13),
  fontWeight: 'bold',
  color: lead.rgb,
});

const controlStyles = css({
  fontFamily: 'inherit',
  fontSize: rem(15),
  color: charcoal.rgb,
  padding: `${rem(10)} ${rem(12)}`,
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(4),
  backgroundColor: 'white',
});

const tableStyles = css({
  width: '100%',
  borderCollapse: 'collapse' as const,
  fontSize: rem(15),
  'th, td': {
    textAlign: 'left' as const,
    padding: `${rem(12)} ${rem(24)}`,
    borderTop: `1px solid ${silver.rgb}`,
  },
  th: {
    fontSize: rem(12),
    letterSpacing: rem(1.2),
    textTransform: 'uppercase' as const,
    color: lead.rgb,
    borderTop: 'none',
  },
});

const errorStyles = css({ color: ember.rgb, fontSize: rem(14), margin: 0 });

const Invites: FC = () => {
  const isCreator = useIsCreator();
  const isAdmin = useIsAdmin();
  const invites = useInvites();
  const createInvite = useCreateInvite();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('member');

  if (!isCreator) {
    return (
      <Card overrideStyles={css({ padding: rem(40) })}>
        <Headline level={3}>Only creators can manage invites</Headline>
      </Card>
    );
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email) return;
    createInvite.mutate({ email, role }, { onSuccess: () => setEmail('') });
  };

  return (
    <>
      <Headline level={2}>Invites</Headline>
      <div css={{ height: rem(16) }} />

      <Card>
        <form css={formStyles} onSubmit={onSubmit}>
          <label css={fieldStyles}>
            <span css={labelStyles}>Email address</span>
            <input
              css={controlStyles}
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
            />
          </label>
          <label css={fieldStyles}>
            <span css={labelStyles}>Role</span>
            <select
              css={controlStyles}
              value={role}
              onChange={(event) => setRole(event.currentTarget.value as Role)}
            >
              <option value="member">Member</option>
              <option value="creator">Creator</option>
              {isAdmin && <option value="admin">Admin</option>}
            </select>
          </label>
          <Button primary type="submit" disabled={createInvite.isPending}>
            {createInvite.isPending ? 'Inviting' : 'Send invite'}
          </Button>
        </form>
        {createInvite.isError && (
          <p css={[errorStyles, { padding: `0 ${rem(24)} ${rem(24)}` }]}>
            We could not send that invite. Check the address and try again.
          </p>
        )}
      </Card>

      <div css={{ height: rem(24) }} />

      <Card>
        {invites.isLoading && <Spinner label="Loading invites" />}
        {!invites.isLoading && (
          <table css={tableStyles}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Invited</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(invites.data ?? []).map((invite) => (
                <tr key={invite.email}>
                  <td>{invite.email}</td>
                  <td>{roleLabel(invite.role)}</td>
                  <td>{formatRecordedAt(invite.createdAt)}</td>
                  <td>
                    {invite.claimedBy ? (
                      <Badge>Claimed</Badge>
                    ) : (
                      <Badge tone="warning">Pending</Badge>
                    )}
                  </td>
                </tr>
              ))}
              {(invites.data ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} css={{ color: lead.rgb }}>
                    Nobody has been invited yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
};

export default Invites;
