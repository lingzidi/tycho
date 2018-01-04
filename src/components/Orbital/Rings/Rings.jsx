import React from 'react';
import PropTypes from 'prop-types';
import {DoubleSide, Euler} from 'three';
import Scale from '../../../utils/Scale';
import MathService from '../../../services/MathService';
import TextureContainer from '../../../containers/TextureContainer';

export default class Rings extends React.Component {

    static propTypes = {
        outerRadius: PropTypes.number.isRequired,
        maps: PropTypes.array.isRequired,
        barycenterTilt: PropTypes.number.isRequired
    }

    render() {
        const tilt = MathService.toRadians(this.props.barycenterTilt);
        const rotation = new Euler(tilt, 0, 0);

        return (
            <mesh rotation={rotation}>
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

