import { createSelector } from 'reselect';

// Gets the appropriate slice in the global app state
const getSetup = appState => appState.setup;

// Gets ID of reddit thread provided while in setup phase
export const getRedditId = createSelector(
  getSetup,
  setup => setup.id
);

// Gets URL of the reddit thread
export const getUrl = createSelector(
  getSetup,
  setup => setup.url
);

// Determines whether post exists on Reddit
export const isExistingPost = createSelector(
  getSetup,
  setup => !!setup.postExistOnReddit
);

// Determines whether user has tried to post the link to Reddit
export const isCreatingPostOnReddit = createSelector(
  getSetup,
  setup => !!setup.creatingPostOnReddit
);

// Gets Reddit API consumer key
export const getConsumerKey = createSelector(
  getSetup,
  setup => setup.consumerKey
);

// Gets Reddit API authentication reddirect URI
export const getRedirectUri = createSelector(
  getSetup,
  setup => setup.redirectUri
);
