import {
  DataProvider,
  FetchOptions,
  LabDataObject,
  ListLabDataObject,
} from '@asap-hub/model';
import { SquidexGraphqlClient } from '@asap-hub/squidex';

export type LabDataProvider = DataProvider<LabDataObject, FetchOptions>;

export class LabSquidexDataProvider implements LabDataProvider {
  constructor(private squidexGraphqlClient: SquidexGraphqlClient) {}

  fetchById(id: string): Promise<LabDataObject | null> {
    throw new Error('Method not implemented.');
  }
  fetch(options: FetchOptions<string[]>): Promise<ListLabDataObject> {}
}
