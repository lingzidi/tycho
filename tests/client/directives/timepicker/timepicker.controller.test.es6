import { TimepickerController }
  from '../../../../client/directives/timepicker/timepicker.controller';
import '../../../../client';
import Fixtures from './__fixtures__';

describe('Testing directives', () => {
  
  let $scope, $compile, element, ctrl;

  beforeEach(() => {
    angular.mock.module('app');

    inject(function($rootScope, _$compile_) {
      $scope = $rootScope.$new();
      $compile = _$compile_;
      ctrl = new TimepickerController($rootScope, $scope);
    });

    element = $compile('<timepicker></timepicker>')($scope);
    element.data('$timepickerController', ctrl);

    $scope.$digest();
  });

  describe('onChange', () => {

    beforeEach(() => {
      ctrl.editableTime = Fixtures.Timepicker.editableTime;
      ctrl.savedTime = Fixtures.Timepicker.savedTime;
    });

    it('should set changed flag to true when editableTime !== savedTime', () => {
      ctrl.onChange();
      ctrl.changed.should.be.true;
    });

    it('should set changed flag to false when editableTime === savedTime', () => {
      ctrl.editableTime = ctrl.savedTime;
      ctrl.onChange();
      ctrl.changed.should.be.false;
    });

  });

  describe('changeTime', () => {

    let setOffset, unixTime;

    beforeEach(() => {
      ctrl.editableTime = Fixtures.Timepicker.editableTime;
      ctrl.savedTime = Fixtures.Timepicker.savedTime;
      ctrl.changed = true;
      unixTime = ctrl.getUnixTime();

      setOffset = sinon.spy(ctrl.scene.clock, 'setOffset');
    });

    describe('when the timepicker is closed', () => {

      beforeEach(() => {
        sinon
          .stub(ctrl, 'isPickerOpen')
          .returns(false);
        ctrl.changeTime();
      });

      it('should call the clock offset function with unix time', () => {
        setOffset.should.have.been.calledOnce;
        setOffset.should.have.been.calledWith(unixTime);
      });

      it('should set savedTime to whatever editableTime is', () => {
        ctrl.savedTime.should.not.be.undefined;
        ctrl.savedTime.should.not.be.null;
        ctrl.savedTime.should.be.a.string;
        ctrl.savedTime.should.equal(ctrl.editableTime);
      });

      it('should set the editable flag back to false', () => {
        ctrl.changed.should.be.false;
      });

    });

    describe('when the timepicker is open', () => {

      beforeEach(() => {
        sinon
          .stub(ctrl, 'isPickerOpen')
          .returns(true);
        ctrl.changeTime();
      });

      it('should not call the clock\'s setOffset function', () => {
        setOffset.should.not.have.been.called;
      });

      it('should have savedTime be different than editableTime', () => {
        ctrl.savedTime.should.not.equal(ctrl.editableTime);
      });

      it('should not set the editable flag back to false', () => {
        ctrl.changed.should.be.true;
      });

    });

  });

  describe('tick', () => {

    let unixTime, changeTime;

    beforeEach(() => {
      unixTime = moment().unix();
      sinon.stub(ctrl, 'changeTime');
      sinon.spy(ctrl.scope, '$apply');
      ctrl.tick(unixTime);
    });

    it('should set currentUnixTime to passed-in time parameter', () => {
      ctrl.currentUnixTime.should.not.be.null;
      ctrl.currentUnixTime.should.be.a.number;
      ctrl.currentUnixTime.should.not.be.NaN;
      ctrl.currentUnixTime.should.equal(unixTime);
    });

    it('should call changeTime once', () => {
      ctrl.changeTime.should.have.been.calledOnce;
    });

    it('should call scope.$apply', () => {
      ctrl.scope.$apply.should.have.been.calledOnce;
    });

  });

  describe('getUnixTime', () => {

    beforeEach(() => {
      ctrl.editableTime = Fixtures.Timepicker.editableTime;
    });

    it('should return the UNIX timestamp of editableTime', () => {
      let time = ctrl.getUnixTime(),
          unix = moment(ctrl.editableTime, ctrl.timeFormat).unix();

      time.should.not.be.undefined;
      time.should.not.be.null;
      time.should.be.a.number;
      time.should.not.be.NaN;
      time.should.equal(unix);
    });

  });

  describe('getFormattedTime', () => {

    beforeEach(() => {
      ctrl.currentUnixTime = moment().unix();
    });

    it('should return a string in YYYY-MM-DD HH:mm:ss format', () => {
      let time = ctrl.getFormattedTime();

      time.should.not.be.undefined;
      time.should.not.be.null;
      time.should.be.a.string;
      time.should.match(/^[0-9]{4}(-[0-9]{2}){2} ([0-9]{2}:){2}[0-9]{2}$/);
    });

  });

  describe('isPickerOpen', () => {

    it('should be truthy when the timepicker is clicked', () => {
      element.find('input')[0].click();
      ctrl.isPickerOpen.should.be.truthy;
    });

    it('should be falsey when the body is clicked', () => {
      document.getElementsByTagName('body')[0].click();
      ctrl.isPickerOpen.should.be.falsey;
    });

  });

});






















