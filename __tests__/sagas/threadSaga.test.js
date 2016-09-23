import { put, call, select } from 'redux-saga/effects';

import buildAction from 'helpers/buildAction';
import {
  EntitiesHaveChanged,
  PostHasBeenLoaded,
  ChangeCommentCount
} from 'constants/actions';
import {
  fetchComments as fetchCommentsEffect
} from 'effects/redditAPI';
import {
  getSort
} from 'selectors/threadSelectors';
import {
  getRedditId
} from 'selectors/setupSelectors';
import {
  getCommentsCount
} from 'selectors/entityRepositorySelectors';
import {
  fetchComments
} from 'sagas/threadSaga';

export const assertIsFetchingComments = (saga) => {
  const sort = 'sort';
  const postId = 'postId';

  // Should get the sort first
  expect(saga.next().value).toEqual(select(getSort));

  // Then it should get the post ID (redditID)
  expect(saga.next(sort).value).toEqual(select(getRedditId));

  // and finally call fetching of posts
  expect(saga.next(postId).value).toEqual(call(fetchCommentsEffect, postId, sort));

  const response = {
    entities: {
      Post: {
        foobar: {}
      }
    },
    result: 'foobar'
  };

  // Now the saga should rember the comment count
  expect(saga.next(response).value)
    .toEqual(select(getCommentsCount));

  // Should notify entity repository that we have loaded new entities
  expect(saga.next(0).value)
    .toEqual(put(buildAction(EntitiesHaveChanged, response.entities)));

  // Should store the result (root entity is Post, holding all the comments)
  expect(saga.next().value)
    .toEqual(put(buildAction(PostHasBeenLoaded, response.result)));

  // Now we get the number of newly fetched comments
  expect(saga.next().value)
    .toEqual(select(getCommentsCount));

  // And we pass the number to ChangeCommentCount action so that
  // we can notify the app about changing the number of comments
  const mockCommentCount = 42;
  expect(saga.next(mockCommentCount).value)
    .toEqual(put(buildAction(ChangeCommentCount, mockCommentCount)));
};

describe('Thread Saga', () => {
  it('should fetch normalized comments', () => {
    const saga = fetchComments();
    assertIsFetchingComments(saga);
  });

  it('should not put ChangeCommentCount when the number comments of the newly fetched entities does not change', () => {
    const saga = fetchComments();

    saga.next();
    saga.next();
    saga.next();
    saga.next({});
    saga.next(42);
    saga.next();
    saga.next();
    const { done, value } = saga.next(42);

    // Because number of comments has not changed
    // we don't expect ChangeCommountCountAction to be put as the last
    // action
    expect(value).not.toEqual(put(buildAction(ChangeCommentCount, 42)));
    expect(done).toBeTruthy();
  });
});
