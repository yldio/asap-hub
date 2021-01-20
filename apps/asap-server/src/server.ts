import { appFactory } from './app';

const port = 3333;
const app = appFactory();

app.listen(port, () => {
  console.log(`ASAP server listening at http://localhost:${port}`);
});
