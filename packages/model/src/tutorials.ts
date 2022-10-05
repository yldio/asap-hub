import { ListResponse } from './common';

export interface TutorialsResponse {
  id: string;
  title: string;
  shortText?: string;
  thumbnail?: string;
  link?: string;
  linkText?: string;
  text?: string;
  created: string;
}
export type ListTutorialsResponse = ListResponse<TutorialsResponse>;
