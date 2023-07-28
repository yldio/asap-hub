import React, { useMemo } from 'react';
import { locations } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import Field from './locations/Field';

const App = () => {
  const sdk = useSDK();

  const Component = useMemo(() => {
    if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
      return Field;
    }
    return null;
  }, [sdk.location]);

  return Component ? <Component /> : null;
};

export default App;
