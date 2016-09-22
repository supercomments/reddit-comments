import * as Actions from 'constants/actions';

const initialState = {
  postExistOnReddit: true, // We optimistically assume that post already exist
  creatingPostOnReddit: false
};

export default (state = initialState, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case Actions.Setup:
      return {
        ...state,
        ...payload
      };

    case Actions.RedditPostIdHasChanged:
      return {
        ...state,
        id: payload
      };

    case Actions.RedditPostDoNotExist:
      return {
        ...state,
        postExistOnReddit: false
      };

    case Actions.UserStartsPostingLinkToReddit:
      return {
        ...state,
        creatingPostOnReddit: true
      };

    case Actions.UserPostedLinkToReddit:
      return {
        ...state,
        postExistOnReddit: true,
        creatingPostOnReddit: false
      };

    default:
      return state;
  }
};
