import React from 'react';
import {DefaultLoadingManager} from 'three';
import {connect} from 'react-redux';
import * as Actions from '../actions/LoaderActions';
import ReduxService from '../services/ReduxService';
import SplashScreen from '../components/SplashScreen';

export class LoaderContainer extends React.Component {

  componentWillMount = () => {
    DefaultLoadingManager.onProgress = this.onProgress;
  }

  /**
   * Updates the redux store with current loader status.
   *
   * @param {String} url - loaded url
   * @param {Number} count - number of textures loaded
   * @param {Number} total - total number of textures enqueued
   */
  onProgress = (url, count, total) => {
    this.props.action.setPercentLoaded(count, total);
    this.props.action.setTextureLoaded(url);
  }

  /**
   * Hides the splash screen, revealing the scene.
   */
  enterScene = () => {
    this.props.action.setUserEntered(true);
  }

  render() {
    return (
      <SplashScreen
        percent={this.props.percent || 0}
        show={!this.props.isUserEntered}
        enterScene={this.enterScene}
        pageText={this.props.pageText}
      />
    );
  }
}

export default connect(
  ReduxService.mapStateToProps(
    'loader.url',
    'loader.percent',
    'loader.isUserEntered',
    'data.pageText'
  ),
  ReduxService.mapDispatchToProps(Actions)
)(LoaderContainer);
