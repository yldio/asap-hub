import { ResourceTypeContentfulDataProvider } from '../../src/data-providers/contentful/resource-type.data-provider';
import { getResourceTypeDataProvider } from '../../src/dependencies/resource-types.dependencies';

describe('Resource Types Dependencies', () => {
  it('Should resolve Resource Type Contentful Data Provider', () => {
    const ResourceTypeDataProvider = getResourceTypeDataProvider();

    expect(ResourceTypeDataProvider).toBeInstanceOf(
      ResourceTypeContentfulDataProvider,
    );
  });
});
