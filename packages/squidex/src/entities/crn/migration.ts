import { Entity, Rest } from '../common';

export interface Migration {
  name: string;
}

export interface RestMigration extends Entity, Rest<Migration> {}
