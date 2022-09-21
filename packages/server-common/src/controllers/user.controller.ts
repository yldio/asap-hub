export interface UserController<T> {
  connectByCode(welcomeCode: string, userId: string): Promise<T>;
}
