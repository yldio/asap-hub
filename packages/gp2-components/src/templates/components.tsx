import colors from './colors';

const components = {
  NavigationLink: {
    styles: {
      svg: {
        fill: 'currentColor',
      },
    },
  },
  textArea: {
    focusStyles: {
      borderColor: colors.primary500,
    },
    maxLengthStyles: {
      color: colors.primary500,
    },
  },
  Accordion: {
    containerStyles: {
      padding: 0,
    },
    itemStyles: {
      margin: 0,
    },
  },
};

export default components;
