import { route, stringParser } from 'typesafe-routes';

const news = (() => route('/:newsId', { newsId: stringParser }, {}))();

const newsList = route('/news', {}, { news });

export default newsList;
