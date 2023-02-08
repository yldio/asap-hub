/* istanbul ignore file */
import { screen } from './pixels';

// For TypeScript to understand the extended matcher
import '@emotion/jest';

export const viewportCalc = (
  calcExpression: string,
  viewportScreen = screen(window.innerWidth, window.innerHeight),
): string => {
  const baseUnitRegex = /\d(cm|mm|in|px|pt|pc|em|ex|ch|rem)\W/g;

  const [[, baseUnit], [, excessUnit] = []] =
    calcExpression.matchAll(baseUnitRegex);
  if (excessUnit) {
    throw new Error(`Found more than one base unit in viewport calc expression.
Calc expression: ${calcExpression}
Found base unit: ${baseUnit}
Found second unit: ${excessUnit}`);
  }

  const vwFactor = viewportScreen.width / 100;
  const vhFactor = viewportScreen.height / 100;
  const vminFactor = viewportScreen.min / 100;
  const vmaxFactor = viewportScreen.max / 100;
  const numbersOnlyCalcExpression = calcExpression
    .replace(baseUnit, '')
    .replace(/(\d)(vw)(\W)/g, `$1 * ${vwFactor}$3`)
    .replace(/(\d)(vh)(\W)/g, `$1 * ${vhFactor}$3`)
    .replace(/(\d)(vmin)(\W)/g, `$1 * ${vminFactor}$3`)
    .replace(/(\d)(vmax)(\W)/g, `$1 * ${vmaxFactor}$3`);

  const calc = (num: number) => num + baseUnit;
  return new Function('calc', `return ${numbersOnlyCalcExpression}`)(calc);
};

export const textContentWithPseudo = (element: HTMLElement): string[] => {
  const texts = [];

  const [, beforeText] =
    getComputedStyle(element, '::before').content.match(/"(.+)"/) || [];
  if (beforeText) texts.push(beforeText);

  const { textContent } = element;
  if (textContent) texts.push(textContent);

  const [, afterText] =
    getComputedStyle(element, '::after').content.match(/"(.+)"/) || [];
  if (afterText) texts.push(afterText);

  return texts;
};
