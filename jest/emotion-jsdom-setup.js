/**
 * Fix for Emotion CSS-in-JS + jsdom + React 18 compatibility issue
 *
 * PROBLEM:
 * When using Emotion (CSS-in-JS library) with jsdom in tests, Emotion can generate
 * malformed CSS selectors that cause jsdom's CSS parser to fail. This typically happens
 * when components use libraries like react-select, which internally uses react-input-autosize.
 * The react-input-autosize component calls window.getComputedStyle() to copy input styles,
 * and jsdom tries to parse Emotion's generated CSS selectors to compute styles.
 *
 * THE ERROR:
 * You'll see errors like: "SyntaxError: 'input,,,,uuid >svg+span' is not a valid selector"
 * Notice the multiple commas (,,,,) which make the selector invalid CSS.
 *
 * WHY IT HAPPENS:
 * - Emotion generates class names with UUIDs for style isolation
 * - In certain scenarios (especially with React 18's concurrent features), Emotion's
 *   selector generation can produce malformed selectors with duplicate commas
 * - jsdom's CSS selector parser (nwsapi) is strict and throws on invalid selectors
 * - getComputedStyle() triggers CSS rule matching, which fails on these selectors
 *
 * WORKAROUND:
 * We wrap window.getComputedStyle() to catch selector parsing errors and return
 * a safe fallback. This allows tests to run without breaking on Emotion's CSS quirks.
 * The fallback returns an object that mimics CSSStyleDeclaration with empty values,
 * which is sufficient for most test scenarios.
 *
 * IMPACT:
 * - Tests can render components that use Emotion + react-select without crashing
 * - Style computation still works for valid selectors (we only catch errors)
 * - For invalid selectors, we return safe defaults (empty strings)
 * - This doesn't affect production code, only the test environment
 *
 */
if (typeof window !== 'undefined') {
  const originalGetComputedStyle = window.getComputedStyle;

  window.getComputedStyle = function getComputedStyle(element, pseudoElement) {
    try {
      // Try to get computed styles normally
      return originalGetComputedStyle.call(window, element, pseudoElement);
    } catch (error) {
      // If selector parsing fails (due to malformed Emotion selectors),
      // return a mock CSSStyleDeclaration that returns empty values
      // This prevents tests from crashing while still allowing components to render
      return {
        getPropertyValue: () => '',
        // Add other CSSStyleDeclaration properties as needed
        length: 0,
        item: () => null,
        // Make it somewhat resemble a real CSSStyleDeclaration
        cssText: '',
      };
    }
  };
}
