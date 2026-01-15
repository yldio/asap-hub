import React, { useMemo } from 'react';
import { locations } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import Field from './locations/Field';
import Sidebar from './locations/Sidebar';

const App = () => {
  const sdk = useSDK();

  const Component = useMemo(() => {
    if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
      return Field;
    }
    if (sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
      return Sidebar;
    }
    return null;
  }, [sdk.location]);

  return Component ? <Component /> : null;
};

export default App;
