import {bindActionCreators} from 'redux';

export default class ReduxService {

  /**
   * Returns a `mapStateToProps` function for Redux.
   * This will map the props from the given reducer name to an object and return it.
   *
   * @param {String} reducer - name of reducer in state
   * @param {...String} props - list of prop names to copy from the reducer
   * @returns {Function<Object>} new props to be assigned
   */
  static mapStateToProps = (reducer, ...props) => {
    return function(state) {
      let data = {};
      props.forEach((prop) => {
        data[prop] = state[reducer][prop];
      });
      return data;
    }
  }

  /**
   * Returns a `mapDispatchToProps` function for Redux.
   * This will convert the given actions to action creators.
   *
   * @param {Object} actions - key-value pair for action methods
   * @returns {Function<Object>}
   */
  static mapDispatchToProps = (actions) => {
    return function(dispatch) {
      return {
        action: bindActionCreators(actions, dispatch)
      };
    }
  }
  
  /**
   * Assigns the payload objects of the given list of props to state.
   * This returns a new copy of state with the mapping.
   *
   * @param {Object} state - current state
   * @param {Object} payload - payload data
   * @param {...String} props - list of keys to assign from
   * @return {Object} new assigned state
   */
  static assign = (state, payload, ...props) => {
    let data = {};

    props.forEach((prop) => {
      data[prop] = payload[prop];
    });

    return Object.assign({}, state, data);
  }
}
