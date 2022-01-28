import { FC, ComponentType, Fragment } from 'react';
import { DecoratorFn } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import { Flag } from '@asap-hub/flags';
import { FlagsContext, useFlags } from '@asap-hub/react-context';

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
      }}
    >
      {children}
    </FlagsContext.Provider>
  );
};
export const makeFlagDecorator =
  (name: string, flag: Flag): DecoratorFn =>
  (storyFn, context) => {
    const enabled = boolean(name, true);
    const Provider: ComponentType = enabled
      ? Fragment
      : ({ children }) => <DisableFlag flag={flag}>{children}</DisableFlag>;
    return <Provider>{storyFn({ ...context })}</Provider>;
  };
