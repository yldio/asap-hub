import tools from 'auth0-deploy-cli';
import { readFileSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';
import packageJson from '../package.json';

const main = async () => {
  const fileName = 'tenant.yaml';
  try {
    const yamlFile = readFileSync(`./${fileName}`, 'utf8');
    const data = yaml.load(yamlFile) as Parameters<
      (typeof tools)['tools']['deploy']
    >[0];

    const actions = data.actions?.map((action) => {
      const dependencies = action.dependencies?.map(
        (dependency: { name: keyof typeof packageJson.dependencies }) => {
          const version = packageJson.dependencies[dependency.name];
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
    writeFileSync(`./build/${fileName}`, yaml.dump({ ...data, actions }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

main().catch(console.error);

export { main };
