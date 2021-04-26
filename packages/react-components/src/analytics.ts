// These data layer variables need to be created in the GTM container

export const SEARCH_QUERY_KEY = 'search_term';
export const SEARCH_PLACEHOLDER_KEY = 'search_placeholder';

export const FILTERS_KEY = 'filter_values';
export const FILTER_TITLE_KEY = 'filter_title';

// These custom event triggers need to be created in the GTM container

export const SEARCH_EVENT = 'search';

export const FILTER_EVENT = 'filter';

// The triggers with their corresponding variables can finally be linked to a Google Analytics Event tag
// The Google Analytics Configuration tag should remain untouched, for the base information such as page views
