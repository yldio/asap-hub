import { route, string } from 'react-router-typesafe-routes/dom';

// const news = (() => route('/:newsId', { newsId: stringParser }, {}))();

// const newsList = route('/news', {}, { news });

const newsList = {
  DEFAULT: route(
    'news/*',
    {},
    {
      LIST: route(''),
      DETAILS: route(':newsId', {
        params: { newsId: string().defined() },
      }),
    },
  ),
};

export default newsList;
