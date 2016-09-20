import React from 'react';
import { render } from 'react-dom';

const doRender = () => {
  const Root = require('./containers').default;

  render(
    <Root url="https://google.com" />,
    document.getElementById('root')
  );
};

doRender();

if (module.hot) {
  module.hot.accept('./containers', doRender);
}
