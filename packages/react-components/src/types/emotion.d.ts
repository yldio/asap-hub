import '@emotion/react';

import { OpaqueColor, TransparentColor } from '../colors';

declare module '@emotion/react' {
  export interface Theme {
    colors?: {
      primaryColor?: OpaqueColor | TransparentColor;
      activePrimaryBackgroundColor?: OpaqueColor | TransparentColor;
      activePrimaryColor?: OpaqueColor | TransparentColor;
    };
    navigationLinkStyles?: SerializedStyles;
  }
}
