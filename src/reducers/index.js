import {combineReducers} from 'redux';
import uiControls from './UIControlsReducer';
import label from './LabelReducer';
import loader from './LoaderReducer';

const rootReducer = combineReducers({
  uiControls,
  label,
  loader
});

export default rootReducer;
