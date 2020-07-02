import Content from './content';

import { cms } from '../config';

export class CMS {
  content: Content;

  constructor() {
    this.content = new Content(cms);
  }
}
