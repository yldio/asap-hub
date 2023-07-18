import { DataProvider, FetchOptions } from '@asap-hub/model';

export async function fetchAll<DataObject, Filter>(
  dataProvider: DataProvider<DataObject, FetchOptions<Filter>>,
  filter?: Filter,
) {
  let page = 1;
  let recordCount = 0;
  let total;
  const items = [];
  const take = 100;

  do {
    const query = {
      take,
      skip: (page - 1) * take,
      filter,
    };

    const res = await dataProvider.fetch(query);

    items.push(...res.items);
    total = res.total;
    page += 1;
    recordCount += res.items.length;
  } while (total > recordCount);

  return { total, items };
}
