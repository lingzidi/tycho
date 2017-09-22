import {combineReducers} from 'redux';
import uiControls from './UIControlsReducer';
import label from './LabelReducer';
import loader from './LoaderReducer';
import tour from './TourReducer';
import animation from './AnimationReducer';

const rootReducer = combineReducers({
  uiControls,
  label,
  loader,
  tour,
  animation
});

export default rootReducer;
