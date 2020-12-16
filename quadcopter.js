/*jshint esversion: 6 */
// @ts-check

/**
 * Minimal Starter Code for the QuadCopter assignment
 */

import * as T from "./THREE/src/Three.js";
import { GrObject } from "./Framework/GrObject.js";
import {shaderMaterial} from "./Framework/shaderHelper.js";

let bodyColor = "#210602";
let propColor = "#a12b1a";
let feelerColor = "#210602";
let qc_time = 0;

// quadcopter
export class Quadcopter extends GrObject {
    constructor() {
        let qc = new T.Group();
        let bodyGeom = new T.SphereGeometry(0.3, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
        let bodyMaterial = shaderMaterial("/for_students/Shaders/check.vs","/for_students/Shaders/check.fs",
        {
            side:T.DoubleSide,
            uniforms: {
                checks : {value: 2.0},
                light  : {value: new T.Vector3(0.8,0,0) },
                dark   : {value: new T.Vector3(0.2,0,0)},
            }
        });

        let bodyMesh = new T.Mesh(bodyGeom, bodyMaterial);
        qc.add(bodyMesh);

        let tailGeom = new T.SphereGeometry(0.4, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
        let tailMesh = new T.Mesh(tailGeom, bodyMaterial);
        tailMesh.position.set(0, 0, -0.4);
        qc.add(tailMesh);

        let headGeom = new T.SphereGeometry(0.2, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
        let headMesh = new T.Mesh(headGeom, bodyMaterial);
        headMesh.position.set(0, 0, 0.3);
        qc.add(headMesh);

        let leg1Geom = new T.CylinderGeometry(0.04, 0.02, 0.5, 8, 6, false, 0, Math.PI * 2);
        let legMateraial = new T.MeshStandardMaterial({ color: bodyColor });
        let leg1Mesh = new T.Mesh(leg1Geom, legMateraial);
        leg1Mesh.position.set(0.2, 0, 0.4);
        leg1Mesh.rotateZ(Math.PI / 3);
        leg1Mesh.rotateX(-Math.PI / 8);
        qc.add(leg1Mesh);

        let leg2Geom = new T.CylinderGeometry(0.04, 0.02, 0.5, 8, 6, false, 0, Math.PI * 2);
        let leg2Mesh = new T.Mesh(leg2Geom, legMateraial);
        leg2Mesh.position.set(-0.2, 0, 0.4);
        leg2Mesh.rotateZ(-Math.PI / 3);
        leg2Mesh.rotateX(-Math.PI / 8);
        qc.add(leg2Mesh);

        let leg3Geom = new T.CylinderGeometry(0.04, 0.02, 0.57, 8, 6, false, 0, Math.PI * 2);
        let leg3Mesh = new T.Mesh(leg3Geom, legMateraial);
        leg3Mesh.position.set(0.4, 0, -0.7);
        leg3Mesh.rotateZ(Math.PI / 3);
        leg3Mesh.rotateX(Math.PI / 8);
        qc.add(leg3Mesh);

        let leg4Geom = new T.CylinderGeometry(0.04, 0.02, 0.57, 8, 6, false, 0, Math.PI * 2);
        let leg4Mesh = new T.Mesh(leg4Geom, legMateraial);
        leg4Mesh.position.set(-0.4, 0, -0.7);
        leg4Mesh.rotateZ(-Math.PI / 3);
        leg4Mesh.rotateX(Math.PI / 8);
        qc.add(leg4Mesh);

        let spinMaterial = new T.MeshStandardMaterial({ color: propColor });
        let posXs = [0.4, -0.4, 0.6, -0.6];
        let posZs = [0.5, 0.5, -0.8, -0.8];
        let propellers = [];
        for (let i = 0; i < 4; i++) {
            let propeller = new T.Group();
            for (let j = 0; j < 4; j++) {
                let spGeom = new T.BoxGeometry(0.07, 0.03, 0.6);
                let spMesh = new T.Mesh(spGeom, spinMaterial);
                spMesh.rotateY(Math.PI * j / 2);
                propeller.add(spMesh);
            }
            propeller.position.y = -0.12;
            propeller.position.x = posXs[i];
            propeller.position.z = posZs[i];
            if (i < 2) {
                propeller.scale.z = 0.8;
            }

            let ringGeom = new T.TorusGeometry(0.35, 0.03, 16, 100, Math.PI * 2);
            if (i < 2) {
                ringGeom = new T.TorusGeometry(0.3, 0.03, 16, 100, Math.PI * 2);
            }
            let ringMaterial = new T.MeshStandardMaterial({ color: propColor });
            let ringMesh = new T.Mesh(ringGeom, ringMaterial);
            ringMesh.position.y = -0.12;
            ringMesh.position.x = posXs[i];
            ringMesh.position.z = posZs[i];

            ringMesh.rotateX(Math.PI / 2);
            qc.add(ringMesh);
            qc.add(propeller);
            propellers.push(propeller);
        }

        let feeler1Geom = new T.TorusGeometry(0.35, 0.02, 16, 100, Math.PI / 3);
        let feelerMaterial = new T.MeshStandardMaterial({ color: feelerColor });
        let feeler1Mesh = new T.Mesh(feeler1Geom, feelerMaterial);
        feeler1Mesh.position.set(0.25, 0.1, 0.7);
        feeler1Mesh.rotateY(Math.PI * 0.7);
        qc.add(feeler1Mesh);

        let feeler2Geom = new T.TorusGeometry(0.35, 0.02, 16, 100, Math.PI / 3);
        let feeler2Mesh = new T.Mesh(feeler2Geom, feelerMaterial);
        feeler2Mesh.position.set(-0.25, 0.1, 0.7);
        feeler2Mesh.rotateY(Math.PI * 0.3);
        qc.add(feeler2Mesh);

        qc.scale.set(1.2,1.2,1.2);
        super("Quadcopter", qc);
        this.qc = qc;
        this.propellers = propellers;
        this.rideable = qc;
    }

    /**
     * @param {number} delta
     * @param {any} timeOfDay
     */
    tick(delta,timeOfDay) {
        let a = 15;
        let speed = 0.0002;
        let dir = 1;
        let height = 12;
        let x = a * Math.sin(qc_time);
        let y = height + 2*Math.cos(qc_time);
        let z = a * Math.sin(qc_time) * Math.cos(qc_time);
        let xp = a * Math.cos(qc_time);
        let yp = a * Math.cos(2 * qc_time);
        this.qc.position.set(dir*z, dir*y, dir*x);
        this.qc.rotation.set(0, Math.PI/2-Math.atan2(xp, yp), 0);

        this.propellers.forEach(p => {
            p.rotateY(delta * speed * 20);
        });
        qc_time += delta * speed;
    }
}
