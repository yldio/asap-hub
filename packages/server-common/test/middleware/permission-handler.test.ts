import { gp2, UserResponse } from '@asap-hub/model';
import { Request, Response } from 'express';
import { permissionHandler } from '../../src/middleware';

describe('permission-handler', () => {
  interface PermissionRequest extends Request<unknown> {
    loggedInUser?: gp2.UserResponse | UserResponse;
  }
  test('next is called when user is onboarded', () => {
    const next = jest.fn();
    const req = {
      loggedInUser: { onboarded: true },
    } as Partial<PermissionRequest>;
    permissionHandler(req as PermissionRequest, {} as Response, next);
    expect(next).toBeCalled();
  });

  test('throws when there is no user', () => {
    const next = jest.fn();
    const req = {} as Partial<PermissionRequest>;
    expect(() =>
      permissionHandler(req as PermissionRequest, {} as Response, next),
    ).toThrow(/user is not onboarded/i);
    expect(next).not.toBeCalled();
  });
  test('throws when the user is not onboarded', () => {
    const next = jest.fn();
    const req = {
      loggedInUser: { onboarded: false },
    } as Partial<PermissionRequest>;
    expect(() =>
      permissionHandler(req as PermissionRequest, {} as Response, next),
    ).toThrow(/user is not onboarded/i);
    expect(next).not.toBeCalled();
  });
});
