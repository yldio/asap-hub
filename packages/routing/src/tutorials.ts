import { route, stringParser } from 'typesafe-routes';

const article = route('/:articleId', { articleId: stringParser }, {});
const tutorial = route('/tutorials', {}, { article });

export default tutorial;
