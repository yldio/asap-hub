import { UserResponse } from '@asap-hub/model';

export interface UserController {
  connectByCode(welcomeCode: string, userId: string): Promise<UserResponse>;
}
