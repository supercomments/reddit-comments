import React, { Component } from 'react';
import { Provider } from 'react-redux';

import buildAction from 'helpers/buildAction';
import * as Actions from 'constants/actions';
import RedditComments from 'containers/RedditComments';
import configureStore from 'store';

export default class Root extends Component {

  constructor(props) {
    super(props);

    const store = configureStore();
    store.dispatch(buildAction(Actions.Setup, {
      id: '52kejn'
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
