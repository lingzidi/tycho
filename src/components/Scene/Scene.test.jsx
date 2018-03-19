import React from 'react';
import React3 from 'react-three-renderer';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import {Vector3, Camera} from 'three';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Scene from '../Scene';
import Controls from '../../utils/Controls';
import data from './__fixtures__/orbitals.json';

describe('Scene Component', () => {
    let component, scene;

    beforeEach(() => {
        component = shallow(<Scene
            orbitalData={data}
            updatePosition={() => {}}
            time={1}
        />);

        scene = component.instance();
    });

    describe('getOrbitalElements()', () => {
        let orbitalContainers;

        beforeEach(() => {
            orbitalContainers = scene.getOrbitalElements(data);
        });

        it('should be an array', () => {
            expect(Array.isArray(orbitalContainers)).toBe(true)
        });

        it('should match the snapshot of OrbitalElements', () => {
            const orbitalJson = toJson(shallow(
                <group>orbitalContainers</group>
            ));

            expect(orbitalJson).toMatchSnapshot();
        });
    });

    describe('render()', () => {
        it('should render the scene', () => {
            expect(toJson(component)).toMatchSnapshot();
        });
    });
});
