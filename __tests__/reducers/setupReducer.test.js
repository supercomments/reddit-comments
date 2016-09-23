import { every } from 'lodash';

import buildAction from 'helpers/buildAction';
import {
  Setup,
  RedditPostIdHasChanged,
  RedditPostDoNotExist,
  UserStartsPostingLinkToReddit,
  UserPostedLinkToReddit
} from 'constants/actions';
import setupReducer, { initialState } from 'reducers/setupReducer';

describe('Setup Reducer', () => {
  it('should set payload into app state on Setup', () => {
    const randomId = Math.random();

    const setupKeys = {
      staticKey: 'bar',
      [randomId]: randomId
    };

    const state = setupReducer(initialState, buildAction(Setup, setupKeys));

    // Every Key from provided setup payload should be in the resulting state
    expect(every(setupKeys, (value, key) => state[key] === value)).toBe(true);

    // Every Key from initial state should be in the resulting state
    expect(every(initialState, (value, key) => state[key] === value)).toBe(true);
  });

  it('should merge payload with app state on Setup', () => {
    const state = setupReducer(initialState, buildAction(Setup, {
      postExistOnReddit: !initialState.postExistOnReddit
    }));

    // Keeps creatingPostOnReddit from previous state
    expect(state.creatingPostOnReddit).toBe(initialState.creatingPostOnReddit);

    // Overrides the postExistOnReddit with the new value
    expect(state.postExistOnReddit).toBe(!initialState.postExistOnReddit);
  });

  it('should change just id of the post when PostIdHasChanged', () => {
    const redditPostId = Math.random();
    const state = setupReducer(initialState, buildAction(RedditPostIdHasChanged, redditPostId));

    expect(every(state, (value, key) => {
      // Only redditPostId should be changed
      if (key === 'redditPostId') {
        return value === redditPostId;
      } else {
        // The rest is untouched
        return initialState[key] === value;
      }
    })).toBeTruthy();
  });

  it('should not reset postExistOnReddit when PostIdHasChanged', () => {
    let state;
    state = setupReducer(state, buildAction(RedditPostDoNotExist));

    // We've just informed the app that post does not exist
    expect(state.postExistOnReddit).toBeFalsy();

    state = setupReducer(state, buildAction(RedditPostIdHasChanged, Math.random()));

    // We've just fetched the post, but it should not
    // mark it as existing post just yet
    expect(state.postExistOnReddit).toBeFalsy();
  });

  it('should set creatingPostOnReddit when UserStartsPostingLinkToReddit and reset it when UserPostedLinkToReddit', () => {
    let state;
    state = setupReducer(state, buildAction(RedditPostDoNotExist));
    expect(state.postExistOnReddit).toBeFalsy();

    state = setupReducer(state, buildAction(UserStartsPostingLinkToReddit));
    expect(state.postExistOnReddit).toBeFalsy();
    expect(state.creatingPostOnReddit).toBeTruthy();

    state = setupReducer(state, buildAction(UserPostedLinkToReddit));
    expect(state.postExistOnReddit).toBeTruthy();
    expect(state.creatingPostOnReddit).toBeFalsy();
  });
});
