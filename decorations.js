/*jshint esversion: 6 */
// @ts-check

import * as T from "./THREE/src/Three.js";
import { GrObject } from "./framework/GrObject.js";
import { OBJLoader } from "./THREE/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "./THREE/examples/jsm/loaders/MTLLoader.js";
import {shaderMaterial} from "./Framework/shaderHelper.js";

// tree
export class Tree extends GrObject {
    /**
     * @param {number} num
     */
    constructor(num) {
        let tree = new T.Group();

        let cylinder_geom = new T.CylinderBufferGeometry(0.05,0.05,0.3,8,1,false, 0, Math.PI*2);
        let cylinder_mat = new T.MeshStandardMaterial({color: "#453407", roughness:0.7});
        let cylinder = new T.Mesh(cylinder_geom, cylinder_mat);
        tree.add(cylinder);
        cylinder.position.y = 0.15;

        let cone_geom_1 = new T.ConeBufferGeometry(0.25,0.4,8,1,false, 0, Math.PI*2);
        let cone_mat_1 = new T.MeshStandardMaterial({color: "#9c7a21", roughness:0.7});
        let cone_1 = new T.Mesh(cone_geom_1, cone_mat_1);
        tree.add(cone_1);
        cone_1.position.y = 0.5;

        let cone_geom_2 = new T.ConeBufferGeometry(0.2,0.3,8,1,false, 0, Math.PI*2);
        let cone_mat_2 = new T.MeshStandardMaterial({color: "#9c7a21", roughness:0.7});
        let cone_2 = new T.Mesh(cone_geom_2, cone_mat_2);
        tree.add(cone_2);
        cone_2.position.y = 0.65;

        let cone_geom_3 = new T.ConeBufferGeometry(0.12,0.2,8,1,false, 0, Math.PI*2);
        let cone_mat_3 = new T.MeshStandardMaterial({color: "#9c7a21", roughness:0.7});
        let cone_3 = new T.Mesh(cone_geom_3, cone_mat_3);
        tree.add(cone_3);
        cone_3.position.y = 0.8;

        super ("Tree" + num, tree);
    }
}

// snowman
export class Snowman extends GrObject {
    /**
     * @param {number} num
     */
    constructor(num) {
        let snowman = new T.Group();
        // body
        let body = new T.SphereGeometry(0.7);
        let bodyMaterial = new T.MeshStandardMaterial({color:"white", roughness:0.8});
        let bodyMesh = new T.Mesh(body, bodyMaterial);
        bodyMesh.position.set(0, 0.7, 0);
        snowman.add(bodyMesh);
        // mid
        let mid = new T.SphereGeometry(0.5);
        let midMesh = new T.Mesh(mid, bodyMaterial);
        midMesh.position.set(0, 1.7, 0);
        snowman.add(midMesh);
        // head
        let head = new T.SphereGeometry(0.4);
        let headMesh = new T.Mesh(head, bodyMaterial);
        headMesh.position.set(0, 2.4, 0);
        snowman.add(headMesh);
        // eyes
        let leftEye = new T.SphereGeometry(0.05);
        let rightEye = new T.SphereGeometry(0.05);
        let eyeMaterial = new T.MeshStandardMaterial();
        eyeMaterial.color = new T.Color("black");
        let leftEyeMesh = new T.Mesh(leftEye, eyeMaterial);
        let rightEyeMesh = new T.Mesh(rightEye, eyeMaterial);
        leftEyeMesh.position.set(0.12, 2.6, 0.3);
        rightEyeMesh.position.set(0.3, 2.6, 0.12);
        snowman.add(leftEyeMesh);
        snowman.add(rightEyeMesh);
        // nose
        let nose = new T.ConeGeometry(0.05, 0.3);
        let noseMaterial = new T.MeshStandardMaterial();
        noseMaterial.color = new T.Color("red");
        let noseMesh = new T.Mesh(nose, noseMaterial);
        noseMesh.position.set(0.4, 2.45, 0.4);
        let axis = new T.Vector3(-1, 0, 1);
        noseMesh.rotateOnAxis(axis, -Math.PI / 3);
        snowman.add(noseMesh);
        // mouse
        let mouse1 = new T.SphereGeometry(0.03);
        let mouse2 = new T.SphereGeometry(0.03);
        let mouse3 = new T.SphereGeometry(0.03);
        let mouse4 = new T.SphereGeometry(0.03);
        let mouse5 = new T.SphereGeometry(0.03);
        let mouseMaterial = new T.MeshStandardMaterial();
        mouseMaterial.color = new T.Color("black");
        let mouse1Mesh = new T.Mesh(mouse1, eyeMaterial);
        let mouse2Mesh = new T.Mesh(mouse2, eyeMaterial);
        let mouse3Mesh = new T.Mesh(mouse3, eyeMaterial);
        let mouse4Mesh = new T.Mesh(mouse4, eyeMaterial);
        let mouse5Mesh = new T.Mesh(mouse5, eyeMaterial);
        mouse1Mesh.position.set(0.15, 2.35, 0.35);
        mouse2Mesh.position.set(0.2, 2.3, 0.3);
        mouse3Mesh.position.set(0.26, 2.25, 0.26);
        mouse4Mesh.position.set(0.3, 2.3, 0.2);
        mouse5Mesh.position.set(0.35, 2.35, 0.15);
        snowman.add(mouse1Mesh);
        snowman.add(mouse2Mesh);
        snowman.add(mouse3Mesh);
        snowman.add(mouse4Mesh);
        snowman.add(mouse5Mesh);
        // hat
        let hat = new T.ConeGeometry(0.28, 0.7);
        let hatMaterial = new T.MeshStandardMaterial();
        hatMaterial.color = new T.Color("red");
        let hatMesh = new T.Mesh(hat, hatMaterial);
        hatMesh.position.set(0, 3.05, 0);
        snowman.add(hatMesh);

        snowman.scale.set(0.8, 0.8, 0.8);

        let snowman_w = new T.Group();
        snowman_w.add(snowman);
        super("Snowman" + num, snowman_w);
        this.snowman = snowman;
        this.snowman_time = 0;
        this.number = num;
    }

    /**
     * @param {number} delta
     * @param {any} timeOfDay
     */
    // @ts-ignore
    tick(delta,timeOfDay) {
        let angle = Math.PI / 18;
        let speed = 0.001;
        let a_now = angle * Math.sin(this.snowman_time);
        this.snowman.rotation.x = a_now;
        this.snowman.rotation.z = a_now;
        this.snowman_time += speed * delta;
    }

    lookFromLookAt() {
        let bbox = new T.Box3();
        bbox.setFromObject(this.objects[0]);
        let x = (bbox.max.x+bbox.min.x)/2;
        let y = (bbox.max.y+bbox.min.y)/2;
        let z = (bbox.max.z+bbox.min.z)/2;

        // make the box a little bigger to deal with think/small objects
        let dx = (bbox.max.x-x) - 0.15;
        let dy = (bbox.max.y-y) - 0.15;
        let dz = (bbox.max.z-z) - 0.15;

        let d = Math.max(dx,dy,dz);

        let fx = x + d*3;
        let fy = y + d*3;
        let fz = z + d*3;

        if (this.number === 2) {
            fx = x + d*3;
            fy = y + d*3;
            fz = z - d*3;
        } else if (this.number === 3) {
            fx = x - d*3;
            fy = y + d*3;
            fz = z - d*3;
        } else if (this.number === 4) {
            fx = x - d*3;
            fy = y + d*3;
            fz = z + d*3;
        }

        return [fx,fy,fz,x,y,z];
    }
}

// grass
export class Grass extends GrObject {
    constructor() {
        let loader = new OBJLoader();
        let grass = new T.Group();
        loader.load("./Models/grass.obj",
			function (t) {
                t.traverse(function (child) {
					if (child.type === "Mesh") {
                        // @ts-ignore
                        child.material = new T.MeshStandardMaterial({color:"green"});
                    }
                });
                let grass_row = 10;
                let grass_col = 12;
                let grass_dis = 3;
                for (let i = 0; i < grass_row; i++) {
                    for (let j = 0; j < grass_col; j++) {
                        let grass_clone = t.clone();
                        grass_clone.position.set(i*grass_dis, 0, j*grass_dis);
                        grass.add(grass_clone);
                    }
                }
			},
			function (xhr) {
				console.log("grass " + (xhr.loaded / xhr.total * 100) + "% loaded");
			},
			// @ts-ignore
			function (err) {
				console.error("Error loading 'grass.obj'");
			}
        );
        grass.position.set(-3, 0, -3);
        grass.scale.set(0.2, 0.2, 0.2);
        super("Grass", grass);
    }

    lookFromLookAt() {
        let bbox = new T.Box3();
        bbox.setFromObject(this.objects[0]);
        let x = (bbox.max.x+bbox.min.x)/2;
        let y = (bbox.max.y+bbox.min.y)/2;
        let z = (bbox.max.z+bbox.min.z)/2;

        // make the box a little bigger to deal with think/small objects
        let dx = (bbox.max.x-x) - 0.05;
        let dy = (bbox.max.y-y) - 0.05;
        let dz = (bbox.max.z-z) - 0.05;

        let d = Math.max(dx,dy,dz);

        let fx = x;
        let fy = y + d*3;
        let fz = z + d;

        return [fx,fy,fz,x,y,z];
    }
}

// flower
export class Flower extends GrObject {
    constructor() {
        let obj_loader = new OBJLoader();
        let mtl_loader = new MTLLoader();
        let flower = new T.Group();
        mtl_loader.load("./Models/flower.mtl", function(m) {
            m.preload();
            obj_loader.setMaterials(m);
            obj_loader.load("./Models/flower.obj",
                function (t) {
                    flower.add(t);
                    t.rotateX(-Math.PI/2);
                    t.rotateZ(Math.PI/2);
                    t.scale.set(0.3,0.3,0.3);
                    t.position.set(0.1,0,0.2);
                },
                function (xhr) {
                    console.log("flower " + (xhr.loaded / xhr.total * 100) + "% loaded");
                },
                // @ts-ignore
                function (err) {
                    console.error("Error loading 'flower.obj'");
                }
            );
        });

        // the crystal ball
        let ball_geom = new T.SphereGeometry(1.5, 10, 12);
        let ball_texture = new T.CubeTextureLoader().load([
            './Images/iceflats_ft.png', './Images/iceflats_bk.png',
            './Images/iceflats_up.png', './Images/iceflats_dn.png',
            './Images/iceflats_rt.png', './Images/iceflats_lf.png', 
        ]);
        let ball_mat = new T.MeshStandardMaterial({envMap: ball_texture, roughness: 0.4});
        let ball = new T.Mesh(ball_geom, ball_mat);
        flower.add(ball);
        ball.position.set(1.8,9.5,0);
        let inner_geom = new T.SphereGeometry(1.45, 10, 12);
        let shader_mat = shaderMaterial("/for_students/Shaders/crystal.vs","/for_students/Shaders/crystal.fs",
        {
            side:T.DoubleSide,
            uniforms: {
                point : {value: new T.Vector2(0, 0)},
                height: {value: 0.0}
            }
        });
        let inner_ball = new T.Mesh(inner_geom, shader_mat);
        flower.add(inner_ball);
        inner_ball.position.set(1.8,9.5,0);

        super("Flower", flower);
        this.inner = inner_ball;
        this.ball_time = 0;
        this.ball_rate = 0.7;
        this.shader = shader_mat;
    }

    /**
     * @param {number} delta
     * @param {any} timeOfDay
     */
    // @ts-ignore
    tick(delta,timeOfDay) {
        if (this.ball_time > 2 * this.ball_rate) {
            let x = 0.5*Math.random()+0.5;
            let y = 0.5*Math.random()+0.5;
            this.shader.uniforms.point.value = new T.Vector2(x, y);
            this.ball_time = 0;
        } else if (this.ball_time > this.ball_rate) {
            this.shader.uniforms.height.value = 2*this.ball_rate - this.ball_time;
        } else {
            this.shader.uniforms.height.value = this.ball_time;
        }
        
        this.ball_time += 0.0002 * delta;
    }

    lookFromLookAt() {
        let bbox = new T.Box3();
        bbox.setFromObject(this.objects[0]);
        let x = (bbox.max.x+bbox.min.x)/2;
        let y = (bbox.max.y+bbox.min.y)/2;
        let z = (bbox.max.z+bbox.min.z)/2;

        // make the box a little bigger to deal with think/small objects
        let dx = (bbox.max.x-x) - 0.15;
        let dy = (bbox.max.y-y) - 0.15;
        let dz = (bbox.max.z-z) - 0.15;

        let d = Math.max(dx,dy,dz);

        let fx = x + d*3;
        let fy = y + d*3;
        let fz = z + d*3;

        return [fx,fy,fz,x,y,z];
    }
}

// shield
export class Shield extends GrObject {
    /**
     * @param {any} world
     */
    constructor(world) {
        let obj_loader = new OBJLoader();
        let shield = new T.Group();
    
        let camera_p = new T.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
        
        let shield_texture = new T.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        let shield_mat = new T.MeshBasicMaterial({map: shield_texture.texture});
        obj_loader.load("./Models/shield.obj",
            function (t) {
                t.traverse(function (child) {
					if (child.type === "Mesh") {
                        // @ts-ignore
                        child.material = shield_mat;
                    }
                });
                shield.add(t);
                t.rotateX(-Math.PI/2);
                t.rotateZ(-Math.PI/2);
                t.scale.set(0.02,0.02,0.02);
                t.position.set(-5.2,1.5,0.2);
            },
            function (xhr) {
                console.log("shield " + (xhr.loaded / xhr.total * 100) + "% loaded");
            },
            // @ts-ignore
            function (err) {
                console.error("Error loading 'shield.obj'");
            }
        );

        super("Shield", shield);
        this.world = world;
        this.camera = camera_p;
        this.texture = shield_texture;
    }

    /**
     * @param {any} delta
     * @param {any} timeOfDay
     */
    tick(delta,timeOfDay) {
        this.world.renderer.setRenderTarget(this.texture);
        this.world.renderer.render(this.world.scene, this.camera);
        this.world.renderer.setRenderTarget(null);
        this.world.renderer.render(this.world.scene, this.world.camera);
        this.camera.position.set(15, 10, 0);
        this.camera.lookAt(1.8, 8, -3.2);
    }

    lookFromLookAt() {
        let bbox = new T.Box3();
        bbox.setFromObject(this.objects[0]);
        let x = (bbox.max.x+bbox.min.x)/2;
        let y = (bbox.max.y+bbox.min.y)/2;
        let z = (bbox.max.z+bbox.min.z)/2;

        // make the box a little bigger to deal with think/small objects
        let dx = (bbox.max.x-x) + 0.05;
        let dy = (bbox.max.y-y) + 0.05;
        let dz = (bbox.max.z-z) + 0.05;

        let d = Math.max(dx,dy,dz);

        let fx = x - d*3;
        let fy = y + d*3;
        let fz = z + d*3;

        return [fx,fy,fz,x,y,z];
    }
}
