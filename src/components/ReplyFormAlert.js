import React, { PropTypes } from 'react';
import cx from 'classnames';

const ReplyFormAlert = ({
  type,
  icon,
  children
}) => (
  <div className="edit-alert">
    <div
      className={cx({
        alert: true,
        [type]: true
      })}
    >
      <span>
        <span
          className={cx({
            icon: true,
            [`icon-${icon}`]: true
          })}
        />
        {children}
      </span>
    </div>
  </div>
);

ReplyFormAlert.propTypes = {
  type: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default ReplyFormAlert;
