import { takeEvery } from 'redux-saga';

import * as Actions from 'constants/actions';

export default function* changeCommentCountSaga() {
  let callback = () => {};

  yield takeEvery([
    Actions.Setup,
    Actions.ChangeCommentCount
  ], function* ({ type, payload }) {
    switch (type) { // eslint-disable-line default-case
      case Actions.Setup:
        callback = payload.onChangeCommentCount ? payload.onChangeCommentCount : callback;
        break;

      case Actions.ChangeCommentCount:
        callback(payload);
        break;
    }
  });
}
