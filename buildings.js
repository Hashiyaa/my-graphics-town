/*jshint esversion: 6 */
// @ts-check

import * as T from "./THREE/src/Three.js";
import { GrObject } from "./framework/GrObject.js";

// buildings
// house
export class House extends GrObject {
    /**
     * @param {any[] | string[]} colors
     * @param {number} [num]
     */
    constructor(colors, num) {
        let house = new T.Group();
        // settings
        let part1Settings = {
            steps: 2,
            depth: 2.5,
            bevelEnabled: false
        };

        let part2Settings = {
            steps: 2,
            depth: 1.7,
            bevelEnabled: false
        };

        // part 1 of the house
        let base_curve_1 = new T.Shape();
        base_curve_1.moveTo(0, 0);
        base_curve_1.lineTo(0, 1.3);
        base_curve_1.lineTo(1, 1);
        base_curve_1.lineTo(1, 0);
        base_curve_1.lineTo(0, 0);
        let base_geom_1 = new T.ExtrudeGeometry(base_curve_1, part1Settings);
        let house_texture = new T.TextureLoader().load("./Images/CobbleStone.jpg");
        house_texture.wrapS = T.RepeatWrapping;
        house_texture.wrapT = T.RepeatWrapping;

        let house_mat = new T.MeshStandardMaterial({ map: house_texture, color: colors[0], metalness: 0.1, roughness: 1 });
        let base_1 = new T.Mesh(base_geom_1, house_mat);
        house.add(base_1);

        // part 2 of the house
        let base_curve_2 = new T.Shape();
        base_curve_2.moveTo(-0.8, 0);
        base_curve_2.lineTo(-0.8, 0.8);
        base_curve_2.lineTo(0, 1.15);
        base_curve_2.lineTo(0, 0);
        base_curve_2.lineTo(-0.8, 0);
        let base_geom_2 = new T.ExtrudeGeometry(base_curve_2, part2Settings);

        let base_2 = new T.Mesh(base_geom_2, house_mat);
        house.add(base_2);
        base_2.translateZ(0.4);

        // part 1 of the roof
        let roof_curve_1 = new T.Shape();
        /**
         * @param {number} x
         */
        function getY(x) { return -0.3 * x + 1.3; }
        let offset = 0.15;
        let height = 0.03;
        roof_curve_1.moveTo(-offset, getY(-offset));
        roof_curve_1.lineTo(-offset, getY(-offset) + height);
        roof_curve_1.lineTo(1 + offset, getY(1 + offset) + height);
        roof_curve_1.lineTo(1 + offset, getY(1 + offset));
        roof_curve_1.lineTo(-offset, getY(-offset));
        let roof_geom_1 = new T.ExtrudeGeometry(roof_curve_1, part1Settings);
        let roof_texture = new T.TextureLoader().load("./Images/roof.jpg");
        roof_texture.wrapS = T.RepeatWrapping;
        roof_texture.wrapT = T.RepeatWrapping;

        let roof_mat = new T.MeshStandardMaterial({ map: roof_texture, color: colors[1], metalness: 0.1, roughness: 1 });
        let roof_1 = new T.Mesh(roof_geom_1, roof_mat);
        house.add(roof_1);

        // part 2 of the roof
        let roof_curve_2 = new T.Shape();
        /**
         * @param {number} x
         */
        function getY2(x) { return (0.35 / 0.8) * x + 1.15; }
        roof_curve_2.moveTo(-0.8 - offset, getY2(-0.8 - offset));
        roof_curve_2.lineTo(-0.8 - offset, getY2(-0.8 - offset) + height);
        roof_curve_2.lineTo(0, getY2(0) + height);
        roof_curve_2.lineTo(0, getY2(0));
        roof_curve_2.lineTo(-0.8 - offset, getY2(-0.8 - offset));
        let roof_geom_2 = new T.ExtrudeGeometry(roof_curve_2, part2Settings);

        let roof_2 = new T.Mesh(roof_geom_2, roof_mat);
        house.add(roof_2);
        roof_2.translateZ(0.4);

        // windows
        let window_texture = new T.TextureLoader().load("./Images/Tudor Window.jpg");

        let window_mat = new T.MeshStandardMaterial({ map: window_texture, color: colors[2], metalness: 0.1, roughness: 1 });
        let window_h = 0.5;
        let positions = [{ x: 1, y: window_h, z: 0.5 }, { x: 1, y: window_h, z: 2 },
        { x: 0.5, y: window_h, z: 0 }, { x: -0.4, y: window_h, z: 0.4 },
        { x: 0.5, y: window_h, z: 2.5 }, { x: -0.4, y: window_h, z: 2.1 }];

        for (let i = 0; i < 6; i++) {
            let window_geom = new T.BoxGeometry(0.02, 0.4, 0.3);
            let window = new T.Mesh(window_geom, window_mat);
            house.add(window);
            window.position.set(positions[i].x, positions[i].y, positions[i].z);
            if (i > 1) {
                window.rotateY(Math.PI / 2);
            }
        }

        // door
        let door_texture = new T.TextureLoader().load("./Images/Privy Council Door.jpg");

        let door_mat = new T.MeshStandardMaterial({ map: door_texture, color: colors[3], metalness: 0.1, roughness: 1 });

        let door_geom = new T.BoxGeometry(0.02, 0.6, 0.3);
        let door = new T.Mesh(door_geom, door_mat);
        house.add(door);
        door.position.set(1, 0.3, 1.25);

        super("House" + num, house);
    }
}

// castle
export class Castle extends GrObject {
    /**
     * @param {any[] | string[]} colors
     */
    constructor(colors) {
        let castle = new T.Group();
        // settings
        let wallSettings = {
            steps: 2,
            depth: 0.3,
            bevelEnabled: false
        };

        // walls and a door
        let wall_texture = new T.TextureLoader().load("./Images/CobbleStone.jpg");
        wall_texture.wrapS = T.RepeatWrapping;
        wall_texture.wrapT = T.RepeatWrapping;
        let wall_mat = new T.MeshStandardMaterial({ map: wall_texture, color: colors[0], metalness: 0.1, roughness: 1 });

        let door_texture = new T.TextureLoader().load("./Images/Medieval Door.jpg");
        let door_mat = new T.MeshStandardMaterial({ map: door_texture, color: colors[1], metalness: 0.2, roughness: 0.7 });

        let wall_height = 2;
        let stone_num = 12;
        let stone_w = 0.2;
        let stone_h = 0.1;
        let wall_length = (2 * stone_num - 1) * stone_w;
        let wall_positions = [{ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 },
        { x: wall_length, y: 0, z: -wall_length }, { x: wall_length, y: 0, z: -wall_length }];

        for (let i = 0; i < 4; i++) {
            let wall_curve = new T.Shape();
            wall_curve.moveTo(0, 0);
            wall_curve.lineTo(0, wall_height);
            for (let j = 0; j < stone_num - 1; j++) {
                wall_curve.lineTo((2 * j + 1) * stone_w, wall_height);
                wall_curve.lineTo((2 * j + 1) * stone_w, wall_height - stone_h);
                wall_curve.lineTo((2 * j + 2) * stone_w, wall_height - stone_h);
                wall_curve.lineTo((2 * j + 2) * stone_w, wall_height);
            }
            wall_curve.lineTo((2 * stone_num - 1) * stone_w, wall_height);
            wall_curve.lineTo((2 * stone_num - 1) * stone_w, 0);
            wall_curve.lineTo(0, 0);
            let wall_geom = new T.ExtrudeGeometry(wall_curve, wallSettings);
            let wall = new T.Mesh(wall_geom, wall_mat);
            castle.add(wall);
            if (!i) {
                let door_geom = new T.BoxBufferGeometry(1.2, 1.2, 0.02);
                let door = new T.Mesh(door_geom, door_mat);
                castle.add(door);
                door.position.set(0, 0.6, -wall_length / 2);
                door.rotateY(Math.PI / 2);
            }
            wall.position.set(wall_positions[i].x, wall_positions[i].y, wall_positions[i].z);
            wall.rotateY(Math.PI * i / 2);
        }

        // windows, cylinders and cones
        let window_texture = new T.TextureLoader().load("./Images/Castle window.jpg");
        let window_mat = new T.MeshStandardMaterial({ map: window_texture, color: colors[2], metalness: 0.1, roughness: 0.6 });

        let height_c = 2.5;
        let cylinder_positions = [{ x: stone_w, y: height_c / 2, z: stone_w }, { x: wall_length - stone_w, y: height_c / 2, z: stone_w },
        { x: stone_w, y: height_c / 2, z: -wall_length - stone_w }, { x: wall_length - stone_w, y: height_c / 2, z: -wall_length - stone_w }];
        let w_rotations = [-3 * Math.PI / 8, Math.PI / 8, -7 * Math.PI / 8, -Math.PI * 11 / 8];
        for (let i = 0; i < 4; i++) {
            let cylinder_geom = new T.CylinderBufferGeometry(0.5, 0.5, 2.5);
            let cylinder = new T.Mesh(cylinder_geom, wall_mat);
            let x = cylinder_positions[i].x;
            let y = cylinder_positions[i].y;
            let z = cylinder_positions[i].z;
            castle.add(cylinder);
            cylinder.position.set(x, y, z);

            let cone_geom = new T.ConeBufferGeometry(0.5, 0.8);
            let cone = new T.Mesh(cone_geom, wall_mat);
            castle.add(cone);
            cone.position.set(x, 2 * y + 0.4, z);

            let window_geom = new T.CylinderBufferGeometry(0.5, 0.5, 0.5, 8, 6, true, 0, Math.PI / 4);
            let window = new T.Mesh(window_geom, window_mat);
            castle.add(window);
            window.position.set(x, y + 0.7, z);
            window.rotateY(w_rotations[i]);
        }

        super("Castle", castle);
    }
}

// church
export class Church extends GrObject {
    /**
     * @param {any[] | string[]} colors
     */
    constructor(colors) {
        let church = new T.Group();
        // settings
        let houseSettings = {
            steps: 2,
            depth: 3,
            bevelEnabled: false
        };

        let towerSettings = {
            steps: 2,
            depth: 0.8,
            bevelEnabled: false
        };

        let topSettings = {
            steps: 2,
            depth: 0.6,
            bevelEnabled: false
        };

        // house
        let house_texture = new T.TextureLoader().load("./Images/CobbleStone.jpg");
        house_texture.wrapS = T.RepeatWrapping;
        house_texture.wrapT = T.RepeatWrapping;
        let house_mat = new T.MeshStandardMaterial({ map: house_texture, color: colors[0], metalness: 0.1, roughness: 1 });

        let house_height = 1.6;
        let house_width = 1;
        let house_curve = new T.Shape();
        house_curve.moveTo(-house_width, 0);
        house_curve.lineTo(-house_width, house_height);
        house_curve.lineTo(0, house_height + 0.5);
        house_curve.lineTo(house_width, house_height);
        house_curve.lineTo(house_width, 0);
        house_curve.lineTo(-house_width, 0);
        let house_geom = new T.ExtrudeGeometry(house_curve, houseSettings);

        let house = new T.Mesh(house_geom, house_mat);
        church.add(house);

        // roof
        let roof_height = 0.03;
        let roof_offset = 0.15;
        let roof_curve = new T.Shape();
        let roof_y = (0.5 / house_width) * (-house_width - roof_offset) + house_height + 0.5;
        roof_curve.moveTo(-house_width - roof_offset, roof_y);
        roof_curve.lineTo(-house_width - roof_offset, roof_y + roof_height);
        roof_curve.lineTo(0, house_height + 0.5 + roof_height);
        roof_curve.lineTo(house_width + roof_offset, roof_y + roof_height);
        roof_curve.lineTo(house_width + roof_offset, roof_y);
        roof_curve.lineTo(0, house_height + 0.5);
        roof_curve.lineTo(-house_width - roof_offset, roof_y);
        let roof_geom = new T.ExtrudeGeometry(roof_curve, houseSettings);

        let roof_texture = new T.TextureLoader().load("./Images/Roof.jpg");
        roof_texture.wrapS = T.RepeatWrapping;
        roof_texture.wrapT = T.RepeatWrapping;
        let roof_mat = new T.MeshStandardMaterial({ map: roof_texture, color: colors[1], metalness: 0.1, roughness: 1 });
        let roof = new T.Mesh(roof_geom, roof_mat);
        church.add(roof);

        // tower
        let tower_height = 3.5;
        let tower_width = 0.7;
        let tower_curve = new T.Shape();
        tower_curve.moveTo(-tower_width, 0);
        tower_curve.lineTo(-tower_width + 0.25, tower_height);
        tower_curve.lineTo(tower_width - 0.25, tower_height);
        tower_curve.lineTo(tower_width, 0);
        tower_curve.lineTo(-tower_width, 0);
        let tower_geom = new T.ExtrudeGeometry(tower_curve, towerSettings);

        let tower = new T.Mesh(tower_geom, house_mat);
        church.add(tower);
        tower.translateZ(-0.2);

        // top
        let top_height = 0.8;
        let top_width = 0.45;
        let top_curve = new T.Shape();
        top_curve.moveTo(-top_width, 0);
        top_curve.lineTo(-top_width + 0.15, top_height);
        top_curve.lineTo(top_width - 0.15, top_height);
        top_curve.lineTo(top_width, 0);
        top_curve.lineTo(-top_width, 0);
        let top_geom = new T.ExtrudeGeometry(top_curve, topSettings);
        let top_mat = new T.MeshStandardMaterial({ map: house_texture, color: colors[2], metalness: 0.1, roughness: 1 });

        let top = new T.Mesh(top_geom, top_mat);
        church.add(top);
        top.position.set(0, 3.5, -0.1);

        // cone
        let cone_geom = new T.ConeBufferGeometry(0.4, 1, 4, 1, false, 0, Math.PI * 2);
        let cone_mat = new T.MeshStandardMaterial({ map: house_texture, color: colors[3], metalness: 0.1, roughness: 1 });
        let cone = new T.Mesh(cone_geom, cone_mat);
        church.add(cone);
        cone.position.set(0, 4.8, 0.2);
        cone.rotateY(Math.PI / 4);

        // door
        let door_texture = new T.TextureLoader().load("./Images/Privy Council Door.jpg");
        let door_mat = new T.MeshStandardMaterial({ map: door_texture, color: colors[4], metalness: 0.2, roughness: 0.7 });
        let door_geom = new T.BoxBufferGeometry(0.5, 1, 0.03);
        let door = new T.Mesh(door_geom, door_mat);
        church.add(door);
        door.position.set(0, 0.4, -0.2);

        // windows
        let window_texture = new T.TextureLoader().load("./Images/Tudor Window.jpg");
        let window_mat = new T.MeshStandardMaterial({ map: window_texture, color: colors[5], metalness: 0.1, roughness: 0.6 });
        let window_h = 0.8;
        let positions = [{ x: 1, y: window_h, z: 0.8 }, { x: 1, y: window_h, z: 2.2 },
        { x: -1, y: window_h, z: 0.8 }, { x: -1, y: window_h, z: 2.2 },
        { x: 0, y: window_h + 1.5, z: -0.2 }];
        for (let i = 0; i < 5; i++) {
            let window_geom = new T.BoxGeometry(0.02, 0.6, 0.35);
            let window = new T.Mesh(window_geom, window_mat);
            church.add(window);
            window.position.set(positions[i].x, positions[i].y, positions[i].z);
            if (i === 4) {
                window.rotateY(Math.PI / 2);
            }
        }

        super("Church", church);
    }
}
