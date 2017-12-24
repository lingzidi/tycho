import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

export default class About extends React.Component {

    static propTypes = {
        text: PropTypes.string.isRequired
    }

    render() {
        return (
            <div className="about">
                <ReactMarkdown source={this.props.text} />
            </div>
        )
    }
}