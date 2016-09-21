import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import buildActionCreators from 'helpers/buildActionCreators';
import * as Actions from 'constants/actions';
import * as Sort from 'constants/sort';
import { getSort, NonExistingRedditPostThreadId } from 'selectors/threadSelectors';
import { getCommentsCount, getPost } from 'selectors/entityRepositorySelectors';
import { isLoading } from 'selectors/throbberSelectors';
import { isAuthenticated } from 'selectors/authenticationSelectors';
import { isExistingPost } from 'selectors/setupSelectors';

import Throbber from 'components/Throbber';
import LayoutWrapper from 'components/LayoutWrapper';
import PrimaryHeader from 'components/PrimaryHeader';
import SecondaryHeader from 'components/SecondaryHeader';

import Thread from 'containers/Thread';
import ReplyForm from 'containers/ReplyForm';

const RedditComments = ({
  loading,
  post,
  existsOnReddit,
  commentsCount,
  selectedSort,
  sortBest,
  sortNewest,
  sortOldest,
  toggleUpvotePost
}) => {
  if (loading) {
    return <Throbber />;
  } else if (!existsOnReddit) {
    return (
      <LayoutWrapper>
        <ReplyForm threadId={NonExistingRedditPostThreadId} />
      </LayoutWrapper>
    );
  } else {
    return (
      <LayoutWrapper>
        <PrimaryHeader
          subreddit={post.subreddit}
          commentsCount={commentsCount}
        />
        <section id="conversation">
          <SecondaryHeader
            sort={selectedSort}
            votes={post.votes}
            upvoted={post.upvoted}
            onSortBest={sortBest}
            onSortNewest={sortNewest}
            onSortOldest={sortOldest}
            onToggleUpvotePost={toggleUpvotePost}
          />
          <div id="posts">
            <ReplyForm threadId={post.id} />
            <Thread isRootThread threadId={post.id} />
          </div>
        </section>
      </LayoutWrapper>
    );
  }
};

RedditComments.propTypes = {
  loading: PropTypes.bool.isRequired,
  commentsCount: PropTypes.number.isRequired,
  selectedSort: PropTypes.string.isRequired,
  post: PropTypes.object,
  existsOnReddit: PropTypes.bool.isRequired,
  sortBest: PropTypes.func.isRequired,
  sortNewest: PropTypes.func.isRequired,
  sortOldest: PropTypes.func.isRequired,
  toggleUpvotePost: PropTypes.func.isRequired
};

const mapStateToProps = appState => ({
  authenticated: isAuthenticated(appState),
  loading: isLoading(appState),
  selectedSort: getSort(appState),
  commentsCount: getCommentsCount(appState),
  post: getPost(appState),
  existsOnReddit: isExistingPost(appState)
});

export default connect(
  mapStateToProps,
  buildActionCreators({
    sort: Actions.Sort,
    toggleUpvotePost: Actions.ToggleUpvotePost,
    logIn: Actions.LogIn
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    sortBest: () => dispatchProps.sort(Sort.Best),
    sortNewest: () => dispatchProps.sort(Sort.Newest),
    sortOldest: () => dispatchProps.sort(Sort.Oldest),
    toggleUpvotePost: () => {
      if (stateProps.authenticated) {
        dispatchProps.toggleUpvotePost();
      } else {
        dispatchProps.logIn();
      }
    }
  })
)(RedditComments);
