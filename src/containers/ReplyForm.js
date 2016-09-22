import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import alien from 'assets/alien.png';
import buildActionCreators from 'helpers/buildActionCreators';
import * as Actions from 'constants/actions';
import * as Entities from 'constants/entities';
import { getReplyForm } from 'selectors/threadSelectors';
import { isAuthenticated, getAuthenticatedUser } from 'selectors/authenticationSelectors';
import { isExistingPost, getUrl, isCreatingPostOnReddit } from 'selectors/setupSelectors';

import ReplyFormAlert from 'components/ReplyFormAlert';

const ReplyForm = ({
  root,
  visible,
  authenticated,
  user,
  text,
  error,
  existsOnReddit,
  creatingPostOnReddit,
  url,
  onSubmitPostToReddit,
  onChange,
  onSubmit,
  onRetry,
  onLogIn
}) => {
  // Root Reply Form is always visible
  if (visible || root) {
    return (
      <div className={root ? 'textarea-wrapper--top-level' : 'reply-form-container'}>
        <form
          className={cx({ reply: true, expanded: true, authenticated })}
          onSubmit={error ? onRetry : onSubmit}
        >
          <div className="postbox">
            <div className="avatar">
              <a className="user">
                <img
                  alt="Avatar"
                  src={alien}
                />
              </a>
            </div>
            <div className="textarea-wrapper" dir="auto">
              <div>
                <textarea
                  className="textarea"
                  placeholder="Join the discussion"
                  value={text}
                  onChange={ev => onChange(ev.target.value)}
                />
              </div>
              {authenticated && !existsOnReddit && !creatingPostOnReddit && (
                <ReplyFormAlert icon="warning" type="error">
                  <span>
                    You must <a
                      href={`http://www.reddit.com/submit?url=${encodeURIComponent(url)}`}
                      onClick={onSubmitPostToReddit}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      submit this post to Reddit
                    </a> before commenting.
                  </span>
                </ReplyFormAlert>
              )}
              {creatingPostOnReddit && (
                <ReplyFormAlert icon="warning" type="success">
                  <span>It can take up to 30 seconds for your submission to be available.</span>
                </ReplyFormAlert>
              )}
              <div className="post-actions">
                {!authenticated && (
                  <div
                    className="not-logged-in"
                    style={{
                      color: 'rgb(63, 69, 73)',
                      padding: '11px 0 0 10px',
                      fontFamily: 'Helvetica Neue, arial, sans-serif',
                      fontSize: '12px'
                    }}
                  >
                    <a onClick={onLogIn}>Login to Reddit</a><span> to post a comment</span>
                  </div>
                )}
                {authenticated && visible && (
                  <div className="logged-in">
                    <section>
                      <div className="temp-post" style={{ textAlign: 'right' }}>
                        <button
                          className={cx({
                            btn: true,
                            'post-action__button': true,
                            disabled: !existsOnReddit
                          })}
                        >
                          {!error && <span>Post as <span>{user}</span></span>}
                          {error && <span>Retry</span>}
                        </button>
                      </div>
                    </section>
                  </div>
               )}
              </div>
            </div>
            {root && (
              <div className="login-form">
                <div>
                  <section className="auth-section logged-out">
                    <div className="guest">
                      <h6 className="guest-form-title">
                        <span
                          className="register-text"
                        >Comments managed by&nbsp;
                          <a
                            href="https://github.com/supercomments/reddit-comments"
                            target="_blank"
                            rel="noopener noreferrer"
                          >reddit-comments&trade;</a>&nbsp;
                          and hosted on&nbsp;
                          <a
                            href="https://www.reddit.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >reddit&copy;
                          </a>
                        </span>
                      </h6>&nbsp;
                      <div className="help-tooltip__wrapper help-icon">
                        <div id="rules" className="tooltip show help-tooltip">
                          <h3 className="help-tooltip__heading">Reddit is an online community where users vote on content</h3>
                          <ul className="help-tooltip__list">
                            <li>
                              <span>We care about your privacy, and we never spam.</span>
                            </li>
                            <li>
                              <span>By creating an account, you agree to reddit's</span>
                              <a href="http://www.reddit.com/help/useragreement"> User Agreement </a>
                              <span>and</span>
                              <a href="http://www.reddit.com/help/privacypolicy"> Privacy Policy</a>
                              <span>.</span>
                            </li>
                            <li>
                              <span>We're proud of them, and you should read them.</span>
                            </li>
                          </ul>
                          <p className="clearfix">
                            <a
                              href="http://www.reddit.com/help/useragreement"
                              className="btn btn-small"
                              target="_blank"
                              rel="noopener noreferrer"
                            >Read full terms and conditions</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    );
  } else {
    return null;
  }
};

ReplyForm.propTypes = {
  root: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.string,
  text: PropTypes.string,
  error: PropTypes.bool,
  url: PropTypes.string.isRequired,
  existsOnReddit: PropTypes.bool.isRequired,
  creatingPostOnReddit: PropTypes.bool.isRequired,
  onSubmitPostToReddit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onLogIn: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired
};

const mapStateToProps = (appState, { threadId }) => {
  const authenticated = isAuthenticated(appState);
  const replyForm = getReplyForm(appState, threadId);
  const user = getAuthenticatedUser(appState);
  const existsOnReddit = isExistingPost(appState);
  const creatingPostOnReddit = isCreatingPostOnReddit(appState);
  const url = getUrl(appState);

  if (replyForm) {
    return {
      ...replyForm,
      authenticated,
      user,
      existsOnReddit,
      creatingPostOnReddit,
      url
    };
  } else {
    // The state slice for ReplyForm might not exist
    // it's basically the case when the ReplyForm has
    // not been activated yet
    return {
      root: false, // This can never be root because root is always visible
      visible: false, // Default state is hidden
      authenticated,
      user,
      existsOnReddit,
      creatingPostOnReddit,
      url
    };
  }
};

export default connect(
  mapStateToProps,
  buildActionCreators({
    onChange: Actions.ReplyFormChangeText,
    onLogIn: Actions.LogIn,
    onSubmit: Actions.SubmitReply,
    onRetry: Actions.Retry,
    onSubmitPostToReddit: Actions.UserStartsPostingLinkToReddit
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onChange: text => dispatchProps.onChange({
      text,
      threadId: ownProps.threadId
    }),
    onSubmit: (ev) => {
      ev.preventDefault();
      if (stateProps.existsOnReddit) {
        dispatchProps.onSubmit(ownProps.threadId);
      }
    },
    onRetry: (ev) => {
      ev.preventDefault();

      dispatchProps.onRetry({
        entityType: Entities.Comment,
        id: ownProps.threadId
      });
    }
  })
)(ReplyForm);
