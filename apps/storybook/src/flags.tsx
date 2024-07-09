import { FC, ComponentType, Fragment } from 'react';
import { Decorator } from '@storybook/react';
import { Flag } from '@asap-hub/flags';
import { FlagsContext, useFlags } from '@asap-hub/react-context';

import { boolean } from './knobs';

const DisableFlag: FC<{ flag: Flag }> = ({ flag, children }) => {
  const { isEnabled, disable, reset, enable } = useFlags();
  return (
    <FlagsContext.Provider
      value={{
        disable,
        reset,
        enable,
        isEnabled: (f) => (f === flag ? false : isEnabled(f)),
        setCurrentOverrides: () => {},
        setEnvironment: () => {},
      }}
    >
      {children}
    </FlagsContext.Provider>
  );
};
export const makeFlagDecorator =
  (name: string, flag: Flag): Decorator =>
  (storyFn, context) => {
    const enabled = boolean(name, true);
    const Provider: ComponentType<React.PropsWithChildren<unknown>> = enabled
      ? Fragment
      : ({ children }) => <DisableFlag flag={flag}>{children}</DisableFlag>;
    return <Provider>{storyFn({ ...context })}</Provider>;
  };
