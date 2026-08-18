import { Router } from 'express';
import { requireCreator } from '../auth';
import { inviteEntity } from '../data/entities';
import { sendInviteEmail } from '../email';
import { createInviteSchema } from '../schemas';
import { currentUser } from './request';
import { validate } from './validate';
import { asyncRouter } from './async-router';

export const invitesRouter = (): Router => {
  const router = asyncRouter();

  router.get('/', requireCreator, async (_req, res) => {
    const { data } = await inviteEntity.query.all({}).go({ pages: 'all' });
    res.json({
      items: data.map((invite) => ({
        email: invite.email,
        role: invite.role,
        createdAt: invite.createdAt,
        ...(invite.claimedBy ? { claimedBy: invite.claimedBy.name } : {}),
      })),
    });
  });

  router.post(
    '/',
    requireCreator,
    validate(createInviteSchema),
    async (req, res) => {
      const { role } = req.body as { role: 'creator' | 'member' };
      const email = (req.body as { email: string }).email.toLowerCase();

      const existing = await inviteEntity.get({ email }).go();
      if (existing.data?.claimedBy) {
        res.status(409).json({ error: 'already_invited' });
        return;
      }

      await inviteEntity
        .upsert({
          email,
          role,
          invitedBy: { sub: currentUser(req).sub, name: currentUser(req).name },
          createdAt: existing.data?.createdAt ?? new Date().toISOString(),
        })
        .go();

      await sendInviteEmail(email);

      res.json({ email, role });
    },
  );

  return router;
};
