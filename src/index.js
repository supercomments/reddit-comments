import React from 'react';
import { render } from 'react-dom';

const doRender = () => {
  const Root = require('./containers').default;

  render(
    <Root consumerKey="CRcRenqfbTCNLw" redirectUri="http://localhost:3000" url="http://google.com" />,
    document.getElementById('root')
  );
};

doRender();

if (module.hot) {
  module.hot.accept('./containers', doRender);
}
