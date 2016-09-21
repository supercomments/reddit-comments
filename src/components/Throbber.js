import React from 'react';

const styles = {
  bubble: {
    height: 52,
    width: 54,
    margin: '0px auto',
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box'
  },
  spinner: {
    boxSizing: 'border-box',
    width: 26,
    height: 26,
    position: 'absolute',
    top: 13,
    left: 15,
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: 'rgba(51, 54, 58, 0.4) transparent',
    borderRadius: 13,
    transformOrigin: '50% 50% 0px'
  }
};

export default () => (
  <div className="disqus-loader-bubble" style={styles.bubble}>
    <div className="disqus-loader-spinner" style={styles.spinner} />
  </div>
);
