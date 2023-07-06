import { Dashboard } from '../dashboard.data-provider';

type Guides = Dashboard['guidesCollection'];

type GuideItem = NonNullable<NonNullable<Guides>['items'][number]>;

type GuideDescription = GuideItem['descriptionCollection'];

type GuideDescriptionBlock = NonNullable<
  NonNullable<GuideDescription>['items'][number]
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

export const parseGuideDescription = (description: GuideDescription) =>
  description?.items
    .filter((block): block is GuideDescriptionBlock => block !== null)
    .map(
      ({
        title,
        bodyText,
        linkUrl,
        linkText,
        sys: { id },
      }: GuideDescriptionBlock) => ({
        title: title ?? undefined,
        bodyText: bodyText ?? '',
        linkText: linkText ?? undefined,
        linkUrl: linkUrl ?? undefined,
        id,
      }),
    ) || [];
