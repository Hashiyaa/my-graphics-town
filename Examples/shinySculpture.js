/*jshint esversion: 6 */
// @ts-check

/*
 * Graphics Town Example Objects
 *
 * Houses: Shiny Sculpture - the simplest possible dynamic environment map
 * 
 * this works, but seems to generate a lot of WebGL warnings - not sure what to do 
 * about that
 */

import * as T from "../THREE/src/Three.js";// we need the GrObject
import { GrObject } from "../Framework/GrObject.js";
// we only need this for type info
import { GrWorld } from "../Framework/GrWorld.js";

export class ShinySculpture extends GrObject {
    /**
     * 
     * @param {GrWorld} world 
     */
    constructor(world) {
        let group = new T.Group();
        super("ShinySculpture",group);

        this.world = world;
        this.cubecam = new T.CubeCamera(1,1000,128);
        this.sculptureGeom = new T.SphereBufferGeometry(2,20,10);
        this.sculptureMaterial = new T.MeshStandardMaterial(
            {
                color: "white",
                roughness : 0.2,
                // @ts-ignore   // envMap has the wrong type
                envMap : this.cubecam.renderTarget.texture
            });
        this.sculpture = new T.Mesh(this.sculptureGeom, this.sculptureMaterial);
        group.add(this.cubecam);
        group.add(this.sculpture);

        group.translateY(2);
    }

    tick(delta, timeOfDay) {
        this.cubecam.update(this.world.renderer,this.world.scene);
    }
}