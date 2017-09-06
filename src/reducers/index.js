import {combineReducers} from 'redux';

const testReducer = (state = []) => state;

const rootReducer = combineReducers({
  testReducer
});

export default rootReducer;
