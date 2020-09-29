import Users from './users';
import ResearchOutputs from './research-outputs';
import Content from './content';

import { cms } from '../config';

export class CMS {
  users: Users;

  researchOutputs: ResearchOutputs;

  content: Content;

  constructor() {
    this.users = new Users(cms);
    this.researchOutputs = new ResearchOutputs(cms);
    this.content = new Content(cms);
  }
}
