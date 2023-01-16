import tools from 'auth0-deploy-cli';
import { readFileSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';

const application = process.argv[2];
const main = async (applicationName: string) => {
  const fileName = 'auth0.yaml';
  try {
    const yamlFile = readFileSync(`./${fileName}`, 'utf8');
    const data = yaml.load(yamlFile) as Parameters<
      typeof tools['tools']['deploy']
    >[0];

    const packageJson = require('../package.json');

    const actions = data.actions?.map((action) => {
      const dependencies = action.dependencies?.map(
        (dependency: { name: string }) => {
          const version =
            packageJson.dependencies[dependency.name] ||
            packageJson.devDependencies[dependency.name];

          return version
            ? {
                ...dependency,
                version,
              }
            : dependency;
        },
      );
      return {
        ...action,
        dependencies,
      };
    });

    const pages = data.pages?.map((page) => ({
      ...page,
      ...(page.html && {
        html: page.html.replace('{{applicationName}}', applicationName),
      }),
    }));

    const updated = JSON.stringify({ ...data, actions, pages });
    writeFileSync(`./build/${fileName}`, updated);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

main(application).catch(console.error);

export {};
