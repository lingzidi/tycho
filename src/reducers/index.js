import {combineReducers} from 'redux';
import uiControls from './UIControlsReducer';
import label from './LabelReducer';

const rootReducer = combineReducers({
  uiControls,
  label
});

export default rootReducer;
