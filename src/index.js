import React from 'react';
import { render } from 'react-dom';

const doRender = () => {
  const Root = require('./containers').default;

  render(
    <Root url="http://blog.javascripting.com/2015/04/17/library-of-the-week-autosize" />,
    document.getElementById('root')
  );
};

doRender();

if (module.hot) {
  module.hot.accept('./containers', doRender);
}
