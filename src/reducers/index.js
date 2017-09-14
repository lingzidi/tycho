import {combineReducers} from 'redux';
import uiControls from './UIControlsReducer';
import label from './LabelReducer';
import loader from './LoaderReducer';
import tour from './TourReducer';

const rootReducer = combineReducers({
  uiControls,
  label,
  loader,
  tour
});

export default rootReducer;
