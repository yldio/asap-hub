import { ResearchThemeContentfulDataProvider } from '../../src/data-providers/contentful/research-theme.data-provider';
import { getResearchThemeDataProvider } from '../../src/dependencies/research-themes.dependencies';

describe('Research Themes Dependencies', () => {
  it('Should resolve Research Theme Contentful Data Provider', () => {
    const ResearchThemeDataProvider = getResearchThemeDataProvider();

    expect(ResearchThemeDataProvider).toBeInstanceOf(
      ResearchThemeContentfulDataProvider,
    );
  });
});
