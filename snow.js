/*jshint esversion: 6 */
// @ts-check

import * as T from "./THREE/src/Three.js";
import { GrObject } from "./framework/GrObject.js";

let flakeGeometry = new T.TetrahedronGeometry(0.03, 1); // radius and detail
let flakeMaterial = new T.MeshStandardMaterial({ color:"#ffffff80", emissive:"white"});     

// snow
export class Snow extends GrObject {
    constructor() {
        let snow = new T.Group();
        super("Snow", snow);
        let flakeCount = 2000;
        for (let i = 0; i < flakeCount; i++) {
            let flakeMesh = new T.Mesh(flakeGeometry, flakeMaterial);
            flakeMesh.position.set(
                (Math.random() - 0.5) * 40,
                Math.random() * 40,
                (Math.random() - 0.5) * 40
            );
            snow.add(flakeMesh);
        }
        this.snow = snow;
    }

    /**
     * @param {number} delta
     * @param {any} timeOfDay
     */
    tick(delta,timeOfDay) {
        let speed = 0.001;
        this.snow.children.forEach(f => {
            if (f.position.y < 0) {
                this.snow.remove(f);
                let flakeMesh = new T.Mesh(flakeGeometry, flakeMaterial);
                flakeMesh.position.set(
                    (Math.random() - 0.5) * 40,
                    Math.random() * 40,
                    (Math.random() - 0.5) * 40
                );
                this.snow.add(flakeMesh);
            } else {
                f.position.y -= speed * delta;
            }
        });
    }
}
