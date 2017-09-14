import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {TourContainer} from '../TourContainer';

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

    beforeEach(() => {
      tourContainer.getTourDuration = jest.fn();
    });

    it('should call setUIControls with false', () => {
      const spy = jest.spyOn(tourContainer.props.action, 'setUIControls');

      tourContainer.componentDidMount();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should call setCameraOrbit with true', () => {
      const spy = jest.spyOn(tourContainer.props.action, 'setCameraOrbit');

      tourContainer.componentDidMount();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should call onOrbitComplete after the calculated duration has passed', () => {
      tourContainer.onOrbitComplete = jest.fn();
      const spy = jest.spyOn(tourContainer, 'onOrbitComplete');
      const duration = 5000;

      tourContainer.componentDidMount();

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

  describe('triggerSkipTour()', () => {
    it('should call tourSkipped with true', () => {
      const spy = jest.spyOn(tourContainer.props.action, 'tourSkipped');

      tourContainer.triggerSkipTour();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(true);
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

  describe('render()', () => {
    it('should render the tour container with the show modifier if isComplete = false', () => {
      component = shallow(<TourContainer
        labels={labels}
        action={action}
        isComplete={false}
      />);
      component.setState({time: 1});

      expect(toJson(component)).toMatchSnapshot();
    });

    it('should render the tour container with the hide modifier if isComplete = true', () => {
      component = shallow(<TourContainer
        labels={labels}
        action={action}
        isComplete={true}
      />);
      component.setState({time: 1});

      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
