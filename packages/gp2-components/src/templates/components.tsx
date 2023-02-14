import colors from './colors';

const components = {
  NavigationLink: {
    styles: {
      svg: {
        fill: 'currentColor',
      },
    },
  },
  form: {
    focusStyle: {
      borderColor: colors.primary500,
    },
  },
  TextArea: {
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
