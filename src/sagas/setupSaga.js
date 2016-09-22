import { put, fork, call, select } from 'redux-saga/effects';

import buildAction from 'helpers/buildAction';
import * as Actions from 'constants/actions';

import {
  restoreSession
} from 'sagas/authenticationSaga';
import {
  withThrobber
} from 'sagas/throbberSaga';
import {
  fetchComments
} from 'sagas/threadSaga';
import {
  getBestRedditPost,
  pollForBestRedditPost
} from 'effects/redditAPI';
import {
  getUrl
} from 'selectors/setupSelectors';

export default function* onSetup() {
  yield* withThrobber(function* () {
    yield fork(restoreSession);

    const url = yield select(getUrl);
    const post = yield call(getBestRedditPost, url);

    if (post) {
      yield put(buildAction(Actions.RedditPostIdHasChanged, post.id));
      yield* fetchComments();
    } else {
      yield put(buildAction(Actions.RedditPostDoNotExist));
    }
  });
}

export function* onStartPostingLinkToReddit() {
  const url = yield select(getUrl);
  const post = yield call(pollForBestRedditPost, url);
  yield put(buildAction(Actions.RedditPostIdHasChanged, post.id));
  yield* fetchComments();
  yield put(buildAction(Actions.UserPostedLinkToReddit));
}
