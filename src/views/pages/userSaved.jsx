import React from 'react';
import constants from '../../constants';
import querystring from 'querystring';

import BasePage from './BasePage';
import ListingList from '../components/ListingList';
import Loading from '../components/Loading';

const PropTypes = React.PropTypes;

class UserSavedPage extends BasePage {
  componentDidMount() {
    super.componentDidMount();

    let {app, userName} = this.props;
    app.emit(constants.TOP_NAV_SUBREDDIT_CHANGE, 'u/' + userName);
  }

  render() {
    let {
      actionName,
      page, 
      token,
      app,
      sort,
      userName,
      apiOptions,
      hidden,
      ctx
    } = this.props;

    let { activities, user } = this.state.data;
    let loaded = this.state.loaded;

    if (!loaded || typeof activities === 'undefined') {
      return (
        <Loading />
      );
    }

    if (activities.length === 0) {

      return (
        <div className='alert alert-info vertical-spacing-top'>
          <p>{ `You have no ${actionName.toLowerCase()} links or comments.` }</p>
        </div>
      );

    } else {

      return (
        <div className='user-page user-saved'>
          <div className='container Listing-container' >
            <div className='vertical-spacing-top'>
              <ListingList
                user={ user }
                app={ app }
                showHidden={ true }
                listings={ activities }
                firstPage={ page }
                hideSubredditLabel={ false }
                token={ token }
                hideUser={ false }
                apiOptions={ apiOptions }
                winWidth={ ctx.winWidth }
              />
            </div>
          </div>
        </div>
      );

    }
  }

  static propTypes = {
    actionName: PropTypes.string.isRequired,
    apiOptions: PropTypes.object,
    data: PropTypes.object,
    page: PropTypes.number,
    sort: PropTypes.string,
    userName: PropTypes.string.isRequired,
  }
}

export default UserSavedPage;
