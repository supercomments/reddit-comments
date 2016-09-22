import { takeEvery } from 'redux-saga';
import { fork } from 'redux-saga/effects';

import * as Actions from 'constants/actions';
import {
  initializeApi,
  onLogin,
  onLoggedIn
} from 'sagas/authenticationSaga';
import {
  fetchCommentsWithThrobber,
  onSubmit,
  onToggleUpvotePost,
  onToggleUpvote,
  onToggleDownvote
} from 'sagas/threadSaga';
import changeCommentCountSaga from 'sagas/changeCommentCountSaga';
import onSetup, { onStartPostingLinkToReddit } from 'sagas/setupSaga';

export default function* () {
  yield [
    fork(changeCommentCountSaga),
    fork(takeEvery, Actions.Setup, initializeApi),
    fork(takeEvery, Actions.Setup, onSetup),
    fork(takeEvery, Actions.LoggedIn, onLoggedIn),
    fork(takeEvery, Actions.LogIn, onLogin),
    fork(takeEvery, Actions.Sort, fetchCommentsWithThrobber),
    fork(takeEvery, Actions.SubmitReply, onSubmit),
    fork(takeEvery, Actions.ToggleUpvotePost, onToggleUpvotePost),
    fork(takeEvery, Actions.ToggleUpvote, onToggleUpvote),
    fork(takeEvery, Actions.ToggleDownvote, onToggleDownvote),
    fork(takeEvery, Actions.UserStartsPostingLinkToReddit, onStartPostingLinkToReddit)
  ];
}
