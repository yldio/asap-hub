/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { parseRichText, RichTextFromQuery } from '@asap-hub/contentful';

export const getMeetingMaterial = <T>(
  material: T,
  isPermanentlyUnavailable: boolean,
  isStale: boolean,
  emptyState: T,
): T | null => {
  const isEmpty = !(Array.isArray(material) ? material.length : material);
  if (isPermanentlyUnavailable || (isEmpty && isStale)) {
    return null;
  }
  return isEmpty ? emptyState : material;
};

export type MeetingMaterial = {
  title: string;
  url: string;
};

export const getContentfulEventMaterial = <ReturnType, EmptyStateType>(
  material: MeetingMaterial[] | RichTextFromQuery | null,
  isPermanentlyUnavailable: boolean,
  isStale: boolean,
  emptyState: EmptyStateType,
): ReturnType | EmptyStateType | null => {
  const isEmpty = !(Array.isArray(material) ? material.length : material);

  if (isPermanentlyUnavailable || (isEmpty && isStale)) {
    return null;
  }

  if (isEmpty) {
    return emptyState;
  }

  return Array.isArray(material)
    ? (material as ReturnType)
    : material && (parseRichText(material) as ReturnType);
};
