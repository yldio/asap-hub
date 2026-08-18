import { Global } from '@emotion/react';
import { FC } from 'react';

import { charcoal, fontStyles, pearl, rem } from './theme';

const lightTokens = {
  '--demo-paper': 'rgb(255, 255, 255)',
  '--demo-pearl': 'rgb(252, 253, 254)',
  '--demo-silver': 'rgb(237, 241, 243)',
  '--demo-steel': 'rgb(223, 229, 234)',
  '--demo-tin': 'rgb(194, 201, 206)',
  '--demo-lead': 'rgb(77, 100, 107)',
  '--demo-charcoal': 'rgb(0, 34, 44)',

  '--demo-ember': 'rgb(205, 20, 38)',
  '--demo-rose': 'rgb(247, 232, 234)',

  '--demo-fern': 'rgb(52, 162, 112)',
  '--demo-pine': 'rgb(40, 121, 83)',
  '--demo-mint': 'rgb(228, 245, 238)',

  '--demo-cerulean': 'rgb(0, 140, 198)',
  '--demo-denim': 'rgb(0, 106, 146)',

  '--demo-info100': 'rgb(230, 243, 249)',
  '--demo-info500': 'rgb(12, 141, 195)',

  '--demo-neutral200': 'rgb(246, 249, 251)',
  '--demo-neutral300': 'rgb(237, 241, 243)',

  '--demo-warning100': 'rgb(248, 237, 222)',
  '--demo-warning500': 'rgb(206, 128, 26)',
  '--demo-warning900': 'rgb(181, 107, 11)',

  '--demo-overlay': 'rgba(0, 0, 0, 0.45)',
  '--demo-shadow-soft': 'rgba(0, 0, 0, 0.12)',
  '--demo-shadow-medium': 'rgba(0, 0, 0, 0.18)',
  '--demo-shadow-strong': 'rgba(0, 0, 0, 0.3)',
};

const darkTokens = {
  '--demo-paper': 'rgb(22, 25, 28)',
  '--demo-pearl': 'rgb(16, 18, 20)',
  '--demo-silver': 'rgb(33, 37, 41)',
  '--demo-steel': 'rgb(48, 54, 60)',
  '--demo-tin': 'rgb(122, 133, 142)',
  '--demo-lead': 'rgb(166, 178, 186)',
  '--demo-charcoal': 'rgb(230, 236, 240)',

  '--demo-ember': 'rgb(244, 106, 118)',
  '--demo-rose': 'rgba(244, 106, 118, 0.16)',

  '--demo-fern': 'rgb(90, 202, 148)',
  '--demo-pine': 'rgb(122, 219, 170)',
  '--demo-mint': 'rgba(90, 202, 148, 0.18)',

  '--demo-cerulean': 'rgb(84, 186, 234)',
  '--demo-denim': 'rgb(122, 202, 240)',

  '--demo-info100': 'rgba(84, 186, 234, 0.16)',
  '--demo-info500': 'rgb(84, 186, 234)',

  '--demo-neutral200': 'rgb(28, 32, 36)',
  '--demo-neutral300': 'rgb(33, 37, 41)',

  '--demo-warning100': 'rgba(229, 165, 74, 0.16)',
  '--demo-warning500': 'rgb(229, 165, 74)',
  '--demo-warning900': 'rgb(240, 190, 120)',

  '--demo-overlay': 'rgba(0, 0, 0, 0.65)',
  '--demo-shadow-soft': 'rgba(0, 0, 0, 0.4)',
  '--demo-shadow-medium': 'rgba(0, 0, 0, 0.5)',
  '--demo-shadow-strong': 'rgba(0, 0, 0, 0.6)',
};

const styles = {
  ':root': { ...lightTokens, colorScheme: 'light' },
  "[data-theme='light']": { ...lightTokens, colorScheme: 'light' },
  "[data-theme='dark']": { ...darkTokens, colorScheme: 'dark' },
  '@media (prefers-color-scheme: dark)': {
    ":root:not([data-theme='light'])": { ...darkTokens, colorScheme: 'dark' },
  },
  '*, *::before, *::after': {
    boxSizing: 'border-box' as const,
  },
  html: {
    ...fontStyles,
    backgroundColor: pearl.rgb,
    color: charcoal.rgb,
  },
  'html, body, #root': {
    width: '100%',
    margin: 0,
    minHeight: '100%',
  },
  'h1, h2, h3, h4, h5, h6, p': {
    margin: 0,
  },
  p: {
    letterSpacing: rem(0.1),
  },
};

const GlobalStyles: FC = () => <Global styles={styles} />;

export default GlobalStyles;
