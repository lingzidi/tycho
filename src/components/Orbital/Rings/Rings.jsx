import React from 'react';
import PropTypes from 'prop-types';
import {DoubleSide} from 'three';
import Scale from '../../../utils/Scale';
import TextureContainer from '../../../containers/TextureContainer';

export default class Rings extends React.Component {

    static propTypes = {
        outerRadius: PropTypes.number.isRequired,
        maps: PropTypes.array.isRequired
    }

    render() {
        return (
            <mesh>
                <planeGeometry
                    width={Scale(this.props.outerRadius * 2)}
                    height={Scale(this.props.outerRadius * 2)}
                />
                <TextureContainer
                    transparent={true}
                    side={DoubleSide}
                    textures={this.props.maps}
                />
            </mesh>
        );
    }
}

