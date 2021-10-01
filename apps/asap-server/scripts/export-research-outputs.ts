import { promises as fs } from 'fs';
import { ListResearchOutputResponse } from '@asap-hub/model';
import ResearchOutputs from '../src/controllers/research-outputs';

const main = async () => {
  const controller = new ResearchOutputs();
  const file = await fs.open('ro.json', 'w');

  let recordCount = 0;
  let total: number;
  let records: ListResearchOutputResponse;
  let page = 1;

  await file.write('[\n');

  do {
    records = await controller.fetch({
      take: 50,
      skip: (page - 1) * 50,
    });

    total = records.total;

    if (page != 1) {
      await file.write(',\n');
    }

    await file.write(JSON.stringify(records.items, null, 2).slice(1, -1));

    page++;
    recordCount += records.items.length;
  } while (total > recordCount);

  await file.write(']');

  console.log(`Finished exporting ${recordCount} records`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
