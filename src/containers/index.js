import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';

import buildAction from 'helpers/buildAction';
import * as Actions from 'constants/actions';
import RedditComments from 'containers/RedditComments';
import configureStore from 'store';

export default class Root extends Component {

  static propTypes = {
    url: PropTypes.string.isRequired,
    onChangeCommentCount: PropTypes.func
  }

  constructor(props) {
    super(props);

    const {
      url,
      onChangeCommentCount
    } = props;

    const store = configureStore();
    store.dispatch(buildAction(Actions.Setup, {
      id: '52kejn',
      url,
      onChangeCommentCount
    }));

    this.state = {
      store
    };
  }

  render() {
    return (
      <Provider store={this.state.store}>
        <RedditComments />
      </Provider>
    );
  }
}
