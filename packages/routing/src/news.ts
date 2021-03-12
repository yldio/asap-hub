import { route, stringParser } from 'typesafe-routes';

const article = route('/:articleId', { articleId: stringParser }, {});
const news = route('/news', {}, { article });

export default news;
