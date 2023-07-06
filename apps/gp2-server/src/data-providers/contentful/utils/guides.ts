import { Dashboard } from '../dashboard.data-provider';

export type Guides = Dashboard['guidesCollection'];

type GuideItem = NonNullable<NonNullable<Guides>['items'][number]>;

export type GuideDescriptionBlock = GuideItem['descriptionCollection'];

type GuideDescription = NonNullable<
  NonNullable<GuideDescriptionBlock>['items'][number]
>;

export const parseGuides = (guides: Guides) =>
  guides?.items
    .filter((guide): guide is GuideItem => guide !== null)
    .map(({ title, icon, descriptionCollection, sys: { id } }: GuideItem) => ({
      title: title ?? '',
      icon: icon?.url ?? undefined,
      description: parseGuideDescription(descriptionCollection),
      id,
    })) || [];

export const parseGuideDescription = (description: GuideDescriptionBlock) =>
  description?.items
    .filter((block): block is GuideDescription => block !== null)
    .map(
      ({
        title,
        bodyText,
        linkUrl,
        linkText,
        sys: { id },
      }: GuideDescription) => ({
        title: title ?? undefined,
        bodyText: bodyText ?? '',
        linkText: linkText ?? undefined,
        linkUrl: linkUrl ?? undefined,
        id,
      }),
    ) || [];
