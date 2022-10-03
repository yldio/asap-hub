import '@emotion/react';

import { OpaqueColor, TransparentColor } from '../colors';

declare module '@emotion/react' {
  export interface Theme {
    colors?: {
      primary100?: OpaqueColor | TransparentColor;
      primary500?: OpaqueColor | TransparentColor;
      primary900?: OpaqueColor | TransparentColor;
      info100?: OpaqueColor | TransparentColor;
      info900?: OpaqueColor | TransparentColor;
    };
  }
}
