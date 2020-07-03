import React, { useEffect, useState } from 'react';
import api from '../api';

const Page: React.FC<{}> = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const requestApi = async () => {
      const resp = await api.users.fetch();

      if (resp.ok) {
        const json = await resp.json();
        setData(json);
      }
    };
    requestApi();
  }, [setData]);

  if (data) {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }
  return null;
};

export default Page;
