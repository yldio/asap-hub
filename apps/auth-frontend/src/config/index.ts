import crnConfig from './crn-config';
import gp2Config from './gp2-config';

const apps = ['crn', 'gp2'] as const;
type App = typeof apps[number];

const getConfig = (app: App) => (app === 'gp2' ? gp2Config : crnConfig);

export const { APP_NAME } = getConfig(process.env.APP as App);
