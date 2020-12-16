/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 * 
 * This is the main file - it creates the world, populates it with 
 * objects and behaviors, and starts things running
 * 
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 * 
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */

import * as T from "./THREE/src/Three.js";
import { GrWorld } from "./Framework/GrWorld.js";
import { GrObject } from "./Framework/GrObject.js";  // only for typing
import * as Helpers from "./Libs/helpers.js";
import { WorldUI } from "./Framework/WorldUI.js";
import { SimpleGroundPlane } from "./Framework/GroundPlane.js";

/** These imports are for the examples - feel free to remove them */
import {SimpleHouse} from "./Examples/house.js";
import {CircularTrack, TrackCube, TrackCar} from "./Examples/track.js";
import {Helicopter, Helipad} from "./Examples/helicopter.js";
import {ShinySculpture} from "./Examples/shinySculpture.js";
import {MorphTest} from "./Examples/morph.js";

import { House, Castle, Church } from "./buildings.js";
import { Tree, Snowman, Grass, Flower, Shield } from "./decorations.js";
import { Train } from "./train.js";
import { Quadcopter } from "./quadcopter.js";
import { Snow } from "./snow.js";

// house, roof, window, door
let house_colors = ["#a0b85f", "#4d5437", "#b7d169", "#86ab0f"];
// wall, door, window
let castle_colors = ["#a0b85f", "#86ab0f", "#576636"];
// house, roof, top, cone, door, window
let church_colors = ["#a0b85f", "#4d5437", "#b8805f", "#b85f5f", "#86ab0f", "#b7d169"];

/**
 * The Graphics Town Main - 
 * This builds up the world and makes it go...
 */
function grtown() {
    // make the world
    let ground_size = 20;
    let snow_ground = new T.TextureLoader().load("./Images/Snow.png");
    snow_ground.wrapS = T.RepeatWrapping;
    snow_ground.wrapT = T.RepeatWrapping;
    snow_ground.repeat.set(ground_size,ground_size);
    let ground_mat = new T.MeshStandardMaterial({map:snow_ground, roughness:0.9});

    let world = new GrWorld({
        width:1000, height:600, // make the window reasonably large
        groundplanesize:ground_size // make the ground plane big enough for a world of stuff
    });

    world.groundplane.mesh.material = ground_mat;

    // put stuff into it
    // houses
    let house_num = 9;
    let house_dis = 15;
    let house_positions = [{ x: house_dis, z: -house_dis - 2.5 }, { x: house_dis / 2, z: -house_dis - 2.5 }, 
        { x: 0, z: -house_dis - 2.5 }, { x: -house_dis / 2, z: -house_dis - 2.5 }, { x: -house_dis, z: -house_dis - 2.5 },
        { x: -house_dis, z: house_dis }, { x: -house_dis / 2, z: house_dis }, { x: 0, z: house_dis }, 
        { x: house_dis / 2, z: house_dis }];
    for (let i = 0; i < house_num; i++) {
        let house = new House(house_colors, i+1);
        world.add(house);
        let x = house_positions[i].x;
        let z = house_positions[i].z;
        house.objects[0].position.set(x, 0, z);
        house.objects[0].translateX(-1);
        house.objects[0].translateZ(1.25);
        house.objects[0].rotateY(Math.PI / 2);
    }

    // castle
    let castle1 = new Castle(castle_colors);
    world.add(castle1);
    castle1.objects[0].scale.set(2, 2, 2);
    castle1.objects[0].position.set(4, 0, -4.5);
    castle1.objects[0].rotateY(Math.PI);

    // church
    let church1 = new Church(church_colors);
    world.add(church1);
    church1.objects[0].position.set(house_dis, 0, house_dis - 0.5);

    // trees
    let tree_num = 8;
    let tree_dis = 7.5;
    for (let i = 0; i < tree_num; i++) {
        let tree = new Tree(i+1);
        world.add(tree);
        tree.objects[0].scale.set(2,2,2);
        if (i < tree_num/2) {
            tree.objects[0].position.set(-11 + i*tree_dis, 0, house_dis+1);
        } else {
            tree.objects[0].position.set(-11 + (i-tree_num/2)*tree_dis, 0, -house_dis-1.5);
        }
    }

    // grass
    let grass = new Grass();
    world.add(grass);

    // flower
    let flower = new Flower();
    world.add(flower);

    // snowman
    let snowman_count = 4;
    let snowman_dis = 7;
    for (let i = 1; i <= snowman_count; i++) {
        let snowman = new Snowman(i);
        if (i === 1) {
            snowman.objects[0].position.set(snowman_dis, 0, snowman_dis);
        } else if (i === 2) {
            snowman.objects[0].position.set(snowman_dis, 0, -snowman_dis);
        } else if (i === 3) {
            snowman.objects[0].position.set(-snowman_dis, 0, -snowman_dis);
        } else {
            snowman.objects[0].position.set(-snowman_dis, 0, snowman_dis);
        }
        snowman.objects[0].rotateY((i-1)*Math.PI/2);
        world.add(snowman);
    }

    // shield
    let shield = new Shield(world);
    shield.objects[0].rotation.set(0,0,-Math.PI/15);
    shield.objects[0].position.set(-0.2,-1,0);
    world.add(shield);

    // train
    let train = new Train();
    world.add(train);
    
    // quadcopter
    let qc1 = new Quadcopter();
    world.add(qc1);

    // snow
    let snow = new Snow();
    world.add(snow);
    
    // skybox
    let skybox_texture = new T.CubeTextureLoader().load([
        './Images/iceflats_ft.png', './Images/iceflats_bk.png',
        './Images/iceflats_up.png', './Images/iceflats_dn.png',
        './Images/iceflats_rt.png', './Images/iceflats_lf.png', 
    ]);
    world.scene.background = skybox_texture;

    // build and run the UI
    // only after all the objects exist can we build the UI
    // @ts-ignore       
    // we're sticking a new thing into the world
    world.ui = new WorldUI(world);
    // now make it go!
    world.go();
}
Helpers.onWindowOnload(grtown);
