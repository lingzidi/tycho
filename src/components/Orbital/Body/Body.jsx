import React from 'react';
import PropTypes from 'prop-types';
import Constants from '../../../constants';
import TextureContainer from '../../../containers/TextureContainer';
import Rings from '../../Orbital/Rings';

export default class Body extends React.Component {

    static propTypes = {
        radius: PropTypes.number.isRequired,
        rings: PropTypes.object,
        rotation: PropTypes.object,
    };

    render() {
        const {rings} = this.props;

        return (
            <group rotation={this.props.rotation}>
                <mesh>
                    <TextureContainer textures={this.props.maps} />
                    <sphereGeometry
                        widthSegments={Constants.WebGL.SPHERE_SEGMENTS}
                        heightSegments={Constants.WebGL.SPHERE_SEGMENTS}
                        radius={this.props.radius}
                    />
                </mesh>
                {rings &&
                    <Rings
                        outerRadius={rings.outerRadius}
                        maps={rings.maps}
                    />
                }
                <axisHelper size={200} rotation={this.props.rotation} />
            </group>
        );
    }
}
