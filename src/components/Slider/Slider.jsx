import React from 'react';
import ReactSlider from 'react-slider';

export default class Slider extends React.Component {

  componentDidMount = () => {
    this.state = {
      value: this.getInitialValue()
    };
  }
  
  getInitialValue = () => {
    const {value} = this.props;
    return value || 0;
  }
  
  getClassName = (subName) => {
    const {orientation} = this.props;
    let baseName = 'slider';
    
    if (subName) {
      baseName += `__${subName}`;
    }
    return `${baseName} ${baseName}--${orientation}`;
  }

  render() {
    return (
      <ReactSlider
        orientation={this.props.orientation}
        className={this.getClassName('container')}
        handleClassName={this.getClassName('handle')}
        barClassName={this.getClassName('bar')}
        pearling={true}
        step={10}
        value={this.props.value}
        onChange={this.onChange}
      />
    );
  }
}
