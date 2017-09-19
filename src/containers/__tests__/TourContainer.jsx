import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {TourContainer} from '../TourContainer';
import TourService from '../../services/TourService';

const labels = [
  {
    duration: 5000,
    text: 'Welcome to the Solar System'
  },
  {
    duration: 5000,
    text: 'This is a real-time interactive simulation of major planetary bodies'
  },
  {
    duration: 3000,
    text: 'Let\'s start exploring'
  }
];

jest.useFakeTimers();

describe('Tour Container', () => {
  let component, tourContainer, action;

  beforeEach(() => {
    action = {
      setUIControls: jest.fn(),
      setCameraOrbit: jest.fn(),
      setActiveOrbital: jest.fn(),
      tourCompleted: jest.fn(),
      tourSkipped: jest.fn(),
      showLabel: jest.fn()
    };

    component = shallow(<TourContainer
      labels={labels}
      action={action}
    />);
    tourContainer = component.instance();
  });

  describe('componentDidMount()', () => {
    it('should call the tour skip action if the tour can be skipped', () => {
      TourService.canSkip = () => true;
      const spy = jest.spyOn(tourContainer.props.action, 'tourSkipped');

      tourContainer.componentDidMount();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(true);;
    });

    it('should initialize the tour if the tour cannot be skipped', () => {
      TourService.canSkip = () => false;
      const spy = jest.spyOn(tourContainer, 'initializeTour');

      tourContainer.componentDidMount();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

  });

  describe('initializeTour()', () => {
    beforeEach(() => {
      tourContainer.getTourDuration = jest.fn();
    });

    it('should call setUIControls with false', () => {
      const spy = jest.spyOn(tourContainer.props.action, 'setUIControls');

      tourContainer.initializeTour();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should call setCameraOrbit with true', () => {
      const spy = jest.spyOn(tourContainer.props.action, 'setCameraOrbit');

      tourContainer.initializeTour();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should call onOrbitComplete after the calculated duration has passed', () => {
      tourContainer.onOrbitComplete = jest.fn();
      const spy = jest.spyOn(tourContainer, 'onOrbitComplete');
      const duration = 5000;

      tourContainer.initializeTour();

      expect(spy).not.toHaveBeenCalled();

      jest.runAllTimers();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('componentWillReceiveProps()', () => {
    let spy;

    beforeEach(() => {
      spy = jest.spyOn(tourContainer, 'skipTour');
    });

    it('should call skipTour() if the isSkipped prop has changed and is true', () => {
      tourContainer.componentWillReceiveProps({isSkipped: true});

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call skipTour() if the isSkipped prop is false', () => {
      tourContainer.componentWillReceiveProps({isSkipped: false});
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not call skipTour() if the isSkipped prop has not changed', () => {
      tourContainer.componentWillReceiveProps({});
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('onOrbitComplete()', () => {
    it('should call setActiveOrbital with the default orbital name', () => {
      const spy = jest.spyOn(tourContainer.props.action, 'setActiveOrbital');

      tourContainer.onOrbitComplete();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('dummyParent'); // TODO: const
    });
  });

  describe('onTourComplete()', () => {
    it('should call tourCompleted with true', () => {
      const spy = jest.spyOn(tourContainer.props.action, 'tourCompleted');

      tourContainer.onTourComplete();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(true);
    });
  });

  describe('skipTour()', () => {
    it('should call the tourCompleted action with `true`', () => {
      const spy = jest.spyOn(tourContainer.props.action, 'tourCompleted');

      tourContainer.skipTour();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should call the setCameraOrbit action with `false`', () => {
      const spy = jest.spyOn(tourContainer.props.action, 'setCameraOrbit');

      tourContainer.skipTour();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should call the setActiveOrbital action with the defined targetName', () => {
      const spy = jest.spyOn(tourContainer.props.action, 'setActiveOrbital');

      tourContainer.skipTour();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('dummyParent'); // TODO
    });
  });

  describe('skipTourTrigger()', () => {
    it('should call skipTour()', () => {
      const spy = jest.spyOn(tourContainer, 'skipTour');

      tourContainer.skipTourTrigger();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLabels()', () => {
    it('should return an array of TourLabels', () => {
      const result = tourContainer.getLabels(labels);

      expect(Array.isArray(result)).toBe(true);

      result.forEach((label) => {
        expect(label).toMatchSnapshot();
      });
    });
  });

  describe('getModifier()', () => {
    it('should return `skip` if isSkipped = true', () => {
      expect(tourContainer.getModifier({
        isSkipped: true
      })).toEqual('skip');
    });

    it('should return `show` if isComplete = false', () => {
      expect(tourContainer.getModifier({
        isComplete: false
      })).toEqual('show');
    });

    it('should return `hide` if isComplete = true', () => {
      expect(tourContainer.getModifier({
        isComplete: true
      })).toEqual('hide');
    });
  });

  describe('render()', () => {
    it('should render the tour container successfully', () => {
      component.setState({time: 1});
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
