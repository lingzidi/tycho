import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';
import './Modal.css';

export default class Modal extends React.Component {

  static propTypes = {
    modalActive: PropTypes.bool,
    closeModal: PropTypes.func.isRequired,
    title: PropTypes.string,
    description: PropTypes.string.isRequired,
    velocity: PropTypes.number,
    magnitude: PropTypes.number
  }

  render() {
    return (
      <div className={`modal modal--${cx({
        open: this.props.modalActive,
        closed: !this.props.modalActive 
      })}`}>
        <div className="modal__header">
          <span>{this.props.title}</span>
					<span className="modal__close" onClick={this.props.closeModal}>
						&times;
					</span>
				</div>
				
				<div className="modal__content">
          <ReactMarkdown source={this.props.description} />
        </div>
				
        <div className="modal__footer">
          <div className="modal__info">
            <span>Velocity at vector:</span><br />
            <span>Distance to Sun:</span>
          </div>
          <div className="modal__info">
            <span>{this.props.velocity} km/s</span><br />
            <span>{this.props.magnitude} AU</span>
          </div>
				</div>
			</div>
    );
  }
}
