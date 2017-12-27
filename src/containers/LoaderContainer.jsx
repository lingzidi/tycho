import React from 'react';
import {DefaultLoadingManager} from 'three';
import {connect} from 'react-redux';
import * as AnimationActions from '../actions/AnimationActions';
import * as LoaderActions from '../actions/LoaderActions';
import ReduxService from '../services/ReduxService';
import SplashScreen from '../components/SplashScreen';

export class LoaderContainer extends React.Component {

  componentWillMount = () => {
    this.setState({hasEntered: false});
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
   * Starts playing the scene.
   */
  enterScene = () => {
    this.props.action.setPlaying(true);
    this.setState({hasEntered: true});
  }

  render() {
    return (
      <SplashScreen
        percent={this.props.percent || 100}
        show={!this.state.hasEntered}
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
    'animation.playing',
    'data.pageText'
  ),
  ReduxService.mapDispatchToProps(
    AnimationActions,
    LoaderActions
  )
)(LoaderContainer);
