import React, { useEffect } from 'react';
import { DecoratorFn } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import type { Flag } from '@asap-hub/flags';
import { LiveFlagsProvider, useFlags } from '@asap-hub/react-context';

const DisableFlag: React.FC<{ flag: Flag }> = ({ flag }) => {
  const { disable, reset } = useFlags();
  useEffect(() => {
    disable(flag);
    return () => {
      reset();
    };
  }, [flag, disable, reset]);
  return null;
};
export const makeFlagDecorator = (name: string, flag: Flag): DecoratorFn => (
  storyFn,
  context,
) => {
  const enabled = boolean(name, true);
  return (
    <LiveFlagsProvider>
      {enabled || <DisableFlag flag={flag} />}
      {storyFn({ ...context })}
    </LiveFlagsProvider>
  );
};
