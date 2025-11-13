import React, { useMemo } from 'react';
import { locations, SidebarExtensionSDK } from '@contentful/app-sdk';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import Sidebar from './locations/Sidebar';

const App = () => {
  const sdk = useSDK();

  // Call autoResizer here so it collapses iframe when we return null
  useAutoResizer();

  const Component = useMemo(() => {
    if (sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
      // Only render the sidebar for Projects content type
      const sidebarSdk = sdk as SidebarExtensionSDK;
      const contentTypeId = sidebarSdk.contentType.sys.id;

      console.log('Content Type ID:', contentTypeId);

      if (contentTypeId === 'projects') {
        return Sidebar;
      }
    }
    return null;
  }, [sdk]);

  return Component ? <Component /> : null;
};

export default App;
