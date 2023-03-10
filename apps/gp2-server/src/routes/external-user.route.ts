import { gp2 as gp2Model } from '@asap-hub/model';
import { Router } from 'express';
import { validateFetchUsersOptions } from '@asap-hub/server-common';

import { ExternalUsersController } from '../controllers/external-users.controller';

export const externalUserRouteFactory = (
  externalUsersController: ExternalUsersController,
): Router =>
  Router().get<gp2Model.FetchUsersOptions, gp2Model.ListExternalUserResponse>(
    '/external-users',
    async (req, res) => {
      const options = validateFetchUsersOptions(req.query);

      const users = await externalUsersController.fetch(options);

      res.json(users);
    },
  );
