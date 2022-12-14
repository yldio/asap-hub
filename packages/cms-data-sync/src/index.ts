import { migrateNews } from './news/news.data-migration';
import { migratePages } from './pages/pages.data-migration';

(async () => {
  await migrateNews();
  await migratePages();
})();
