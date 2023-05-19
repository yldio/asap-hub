import { gp2 as gp2Model } from '@asap-hub/model';
import { validateFetchExternalUsersOptions } from '@asap-hub/server-common';
import { Router } from 'express';

import { ExternalUsersController } from '../controllers/external-users.controller';

export const externalUserRouteFactory = (
  externalUsersController: ExternalUsersController,
): Router =>
  Router().get<
    gp2Model.FetchExternalUsersOptions,
    gp2Model.ListExternalUserResponse
  >('/external-users', async (req, res) => {
    const options = validateFetchExternalUsersOptions(req.query);

    const users = await externalUsersController.fetch(options);

    res.json(users);
  });
