import { createSelector } from 'reselect';

export const NonExistingRedditPostThreadId = 'NonExisting';


// Gets the appropriate slice in the global app state
const getThread = appState => appState.thread;

// Gets Reply Form instance state slice
export const getReplyForm = createSelector(
  getThread,
  (appState, threadId) => threadId,
  (thread, threadId) => {
    if (threadId === NonExistingRedditPostThreadId) {
      return {
        root: true,
        visible: true
      };
    } else {
      return thread.replyForms[threadId];
    }
  }
);

// Gets current sort
export const getSort = createSelector(
  getThread,
  thread => thread.sort
);
