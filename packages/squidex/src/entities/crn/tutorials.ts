import { Rest, Entity } from '../common';

export interface Tutorials<TThumbnail = string> {
  title: string;
  shortText: string;
  thumbnail: TThumbnail[];
  text: string;
  link?: string;
  linkText?: string;
}

export interface RestTutorials extends Entity, Rest<Tutorials> {}
