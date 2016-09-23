import { put, call, select, fork } from 'redux-saga/effects';

import buildAction from 'helpers/buildAction';
import {
  RedditPostDoNotExist,
  RedditPostIdHasChanged,
  UserPostedLinkToReddit
} from 'constants/actions';
import {
  setup,
  onStartPostingLinkToReddit
} from 'sagas/setupSaga';
import {
  restoreSession
} from 'sagas/authenticationSaga';
import { getUrl } from 'selectors/setupSelectors';
import {
  getBestRedditPost,
  pollForBestRedditPost
} from 'effects/redditAPI';

import { assertIsFetchingComments } from './threadSaga.test.js';

describe('Setup Saga', () => {
  it('should put RedditPostDoNotExist when API returns null', () => {
    const saga = setup();

    // must restore auth session after setup
    expect(saga.next().value).toEqual(fork(restoreSession));
    // must get post URL from setup state
    expect(saga.next().value).toEqual(select(getUrl));

    const url = 'mockUrl';
    // must call the function to get best reddit post with retrieved URL
    expect(saga.next(url).value).toEqual(call(getBestRedditPost, url));

    // must dispatch an action that reddit post does not exist
    // when API returns null
    expect(saga.next(null).value).toEqual(put(buildAction(RedditPostDoNotExist)));
  });

  it('should put RedditPostIdHasChanged with post ID when API returns post and start fetching comments', () => {
    const saga = setup();

    saga.next();
    saga.next();
    saga.next();

    const id = Math.random();
    const mockPost = { id };

    // Put the newly obtained ID to store
    expect(saga.next(mockPost).value).toEqual(put(buildAction(RedditPostIdHasChanged, id)));

    // Then we expect fetching of comments to start
    assertIsFetchingComments(saga);
  });

  it('should put UserPostedLinkToReddit right after comments are refetched after reddit polling returns freshly created post', () => {
    const saga = onStartPostingLinkToReddit();

    // Should get URL of post to start polling
    expect(saga.next().value).toEqual(select(getUrl));

    const mockPostUrl = 'foobar';
    // should schedule a polling of the post on specific URL
    expect(saga.next(mockPostUrl).value).toEqual(call(pollForBestRedditPost, mockPostUrl));

    const id = Math.random();
    const mockPost = { id };
    // Should put an action that ID of the current post has been changed
    expect(saga.next(mockPost).value).toEqual(put(buildAction(RedditPostIdHasChanged, id)));

    // now it should refetch the comments (with root post of course)
    assertIsFetchingComments(saga);

    // Now we expect to inform the application that user has already posted the link to reddit
    expect(saga.next().value).toEqual(put(buildAction(UserPostedLinkToReddit)));

    // Saga has already finished here
    const { done } = saga.next();
    expect(done).toBeTruthy();
  });
});
