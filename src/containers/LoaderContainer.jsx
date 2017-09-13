import React from 'react';
import {DefaultLoadingManager} from 'three';
import {connect} from 'react-redux';
import * as Actions from '../actions/LoaderActions';
import ReduxService from '../services/ReduxService';

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
   * Returns the class name based on percentage.
   *
   * @return {String} class name
   */
  getClassName = () => {
    let className = 'loader';

    if (this.props.percent === 100) {
        className += ' loader--hide';
    }
    return className;
  }
  
  /**
   * Returns current loaded percent, or zero if undefined.
   * 
   * @return {String} - loaded percent
   */
  getPercent = () => this.props.percent || 0;

  render() {
    return (
      <div className={this.getClassName()}>
        <h3>{this.getPercent()}% loaded.</h3>
      </div>
    );
  }
}

export default connect(
  ReduxService.mapStateToProps(
    'loader.url',
    'loader.percent'
  ),
  ReduxService.mapDispatchToProps(Actions)
)(LoaderContainer);
