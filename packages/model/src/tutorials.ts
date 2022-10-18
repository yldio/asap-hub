import { ListResponse } from './common';

export interface TutorialsDataObject {
  id: string;
  title: string;
  shortText?: string;
  thumbnail?: string;
  link?: string;
  linkText?: string;
  text?: string;
  created: string;
}
export type TutorialsResponse = TutorialsDataObject;

export type ListTutorialsResponse = ListResponse<TutorialsResponse>;
