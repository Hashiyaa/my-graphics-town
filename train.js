
/*jshint esversion: 6 */
// @ts-check

import * as T from "./THREE/src/Three.js";
import { GrObject } from "./Framework/GrObject.js";
import { OBJLoader } from "./THREE/examples/jsm/loaders/OBJLoader.js";

// define your vehicles here - remember, they need to be imported
// into the "main" program

let thePoints = [[15, 10], [15, 0], [15, -10], [0, -10], [-15, -10], 
    [-15, 0], [-15, 10], [0, 10]];
let s = 1; // the scaling factor of cardinal splines
let steps = 25;

// track
class Track extends GrObject {
    constructor() {
        let track = new T.Group();
        super("Track", track);
        // draw the track
        let width = 1.5;
        let steps_curve = 25 * thePoints.length;
        let inner_curve = new T.Group();
        let outer_curve = new T.Group();
        for (let i = 0; i < thePoints.length; i++) {
            // draw the outer curve
            let [x, y, angle] = this.get_position_and_angle(thePoints.length *
                (steps_curve - 1) / steps_curve);
            let last_x = x;
            let last_y = y;
            let line_mat = new T.MeshStandardMaterial({color: "black"});
            for (let u = 0, j = 0; j <= steps_curve; j++, u += thePoints.length / steps_curve) {
                // rounding error is annoying, so make sure we get exactly to the number of points
                if (j === steps_curve) u = 0;
                let [x, y, angle] = this.get_position_and_angle(u);
                let dx = x - last_x;
                let dy = y - last_y;
                let mag = Math.sqrt(dx * dx + dy * dy);
                let line_geom = new T.BoxGeometry(1.5*mag, 0.2, 0.15);
                let line_mesh = new T.Mesh(line_geom, line_mat);
                line_mesh.position.set((x+last_x)/2-(width*dy/mag)/2, 0.1, (y+last_y)/2+(width*dx/mag)/2);
                line_mesh.rotateY(-angle);
                inner_curve.add(line_mesh);
                // draw the inner curve
                let line_geom_2 = new T.BoxGeometry(1.2*mag, 0.2, 0.15); 
                let line_mesh_2 = new T.Mesh(line_geom_2, line_mat);
                line_mesh_2.position.set((x+last_x)/2+(width*dy/mag)/2, 0.1, (y+last_y)/2-(width*dx/mag)/2);
                line_mesh_2.rotateY(-angle);
                outer_curve.add(line_mesh_2);
                last_x = x;
                last_y = y;
            }
        }

        // draw the rail ties
        let ties = new T.Group();
        let dis = 0.16;
        let lengths = this.arc_parametrize();
        let total = lengths[lengths.length - 1];
        let real_dis = total / (thePoints.length / dis);
        for (let i = 0; i < lengths.length && i * real_dis <= total; i++) {
            let u = i * real_dis;
            let t = 0;
            for (let j = 1; j < lengths.length; j++) {
                if (u < lengths[j]) {
                    u -= lengths[j - 1];
                    u /= lengths[j] - lengths[j - 1];
                    t = u * thePoints.length / steps_curve + (j - 1) * (thePoints.length / steps_curve);
                    // console.log(t);
                    break;
                }
            }
            if (t >= thePoints.length) t = 0;
            let [pos_x, pos_y, angle] = this.get_position_and_angle(t);
            let rod_geom = new T.BoxGeometry(width, 0.1, 0.2);
            let rod_mat = new T.MeshStandardMaterial({color: "black"});
            let rod_mesh = new T.Mesh(rod_geom, rod_mat);
            rod_mesh.position.set(pos_x, 0.05, pos_y);
            rod_mesh.rotateY(Math.PI/2-angle);
            ties.add(rod_mesh);
        }
        track.add(inner_curve);
        track.add(outer_curve);
        track.add(ties);
    }

    /**
     * Get the deravatives at the beginning point and the end point.
     * 
     * @param {number} i
     */
    get_deravatives(i) {
        // Based on the formula p(i)' = s(p(i+1) - p(i-1))
        let pre_1 = (i + thePoints.length - 1) % thePoints.length;
        let next_1 = (i + 1) % thePoints.length;
        let [der_x_1, der_y_1] = [s * (thePoints[next_1][0] - thePoints[pre_1][0]),
        s * (thePoints[next_1][1] - thePoints[pre_1][1])];
        let pre_2 = (i) % thePoints.length;
        let next_2 = (i + 2) % thePoints.length;
        let [der_x_2, der_y_2] = [s * (thePoints[next_2][0] - thePoints[pre_2][0]),
        s * (thePoints[next_2][1] - thePoints[pre_2][1])];
        return [der_x_1, der_y_1, der_x_2, der_y_2];
    }

    /**
     * Get the position and angle on the curve for a given parameter
     * 
     * @param {number} u
     */
    get_position_and_angle(u) {
        if (u < 0) u += thePoints.length;
        let i = Math.floor(u); // determine the current segment
        u = u - i;
        let next = (i + 1) % thePoints.length;
        let [der_x_1, der_y_1, der_x_2, der_y_2] = this.get_deravatives(i);
        // coeficients for f(u)
        let c1 = 1 - 3 * Math.pow(u, 2) + 2 * Math.pow(u, 3);
        let c2 = u - 2 * Math.pow(u, 2) + Math.pow(u, 3);
        let c3 = 3 * Math.pow(u, 2) - 2 * Math.pow(u, 3);
        let c4 = 0 - Math.pow(u, 2) + Math.pow(u, 3);
        // console.log(i);
        let pos_x = c1 * thePoints[i][0] + c2 * der_x_1 +
            c3 * thePoints[next][0] + c4 * der_x_2;
        let pos_y = c1 * thePoints[i][1] + c2 * der_y_1 +
            c3 * thePoints[next][1] + c4 * der_y_2;
        // coeficents for f'(u)
        let c1_d = 0 - 6 * u + 6 * Math.pow(u, 2);
        let c2_d = 1 - 4 * u + 3 * Math.pow(u, 2);
        let c3_d = 6 * u - 6 * Math.pow(u, 2);
        let c4_d = 0 - 2 * u + 3 * Math.pow(u, 2);
        let dir_x = c1_d * thePoints[i][0] + c2_d * der_x_1 +
            c3_d * thePoints[next][0] + c4_d * der_x_2;
        let dir_y = c1_d * thePoints[i][1] + c2_d * der_y_1 +
            c3_d * thePoints[next][1] + c4_d * der_y_2;
        let angle = Math.atan2(dir_y, dir_x);
        return [pos_x, pos_y, angle];
    }

    /**
     * Do the arc_parametrization
     */
    arc_parametrize() {
        let lengths = [];
        let total = 0; // keep track of the total lengh of the track
        let [st_x, st_y, angle] = this.get_position_and_angle(0);
        let last_x = st_x;
        let last_y = st_y;
        for (let j = 0, u = 0; j <= steps * thePoints.length; j++, u += 1 / steps) {
            if (thePoints.length <= u) u = 0;
            let [x, y, angle] = this.get_position_and_angle(u);
            let dx = x - last_x;
            let dy = y - last_y;
            let mag = Math.sqrt(dx * dx + dy * dy);
            total += mag;
            lengths.push(total);
            last_x = x;
            last_y = y;
        }
        // return accumulative segment lengths
        return lengths;
    }
}

let head; // store the loaded train head
// train
export class Train extends GrObject {
    constructor() {
        let train_track = new T.Group();
        super("Train", train_track);
        // add the track
        this.track = new Track();
        train_track.add(this.track.objects[0]);

        let train = new T.Group();
        // train head
        let head_texture = new T.TextureLoader().load("./Images/Painted_metal.png");
        head_texture.wrapS = T.RepeatWrapping;
        head_texture.wrapT = T.RepeatWrapping;
        let train_mat = new T.MeshStandardMaterial({ map: head_texture, color: "#dba3c3", metalness: 0.5, roughness: 0.2 });
        let loader = new OBJLoader();
        loader.load("./Models/train_head.obj",
			function (t) {
				t.traverse(function (child) {
					if (child.type === "Mesh") {
                        // @ts-ignore
                        child.material = train_mat;
                    }
                });
                head = t;
                train.add(head);
                head.scale.set(0.12, 0.12, 0.12);
			},
			function (xhr) {
				console.log("train-head " + (xhr.loaded / xhr.total * 100) + "% loaded");
			},
			function (err) {
				console.error("Error loading 'train.obj'");
			}
        );

        // carts
        let cart_texture = new T.TextureLoader().load("./Images/Train.jpg");
        let cart_mat = new T.MeshStandardMaterial({ color: "#f8536f", map: cart_texture, normalMap: cart_texture});
        cart_mat.flatShading = true;
        
        let rod_mat = train_mat.clone();
        rod_mat.flatShading = true;
        rod_mat.roughness = 0.5;

        let num_carts = 6;
        let num_wheels = 6;
        for (let i = 0; i < num_carts; i++) {
            let cart = new T.Group();
            // links between carts
            let link_geom = new T.CylinderGeometry(0.05,0.05,0.5,8,1,false,0,Math.PI*2);
            let link = new T.Mesh(link_geom, rod_mat);
            cart.add(link);
            link.position.set(0,0.5,-1);
            link.rotateX(Math.PI/2);

            let cart_geom = new T.Geometry();
            let off_x = 0.3;
            let off_z = 0.3;
            let off_y = 0.75;
            cart_geom.vertices.push(new T.Vector3(-off_x, -off_y, -off_z));
            cart_geom.vertices.push(new T.Vector3(off_x, -off_y, -off_z));
            cart_geom.vertices.push(new T.Vector3(off_x, -off_y, off_z));
            cart_geom.vertices.push(new T.Vector3(-off_x, -off_y, off_z));
            cart_geom.vertices.push(new T.Vector3(-off_x, off_y, -off_z));
            cart_geom.vertices.push(new T.Vector3(off_x, off_y, -off_z));
            cart_geom.vertices.push(new T.Vector3(off_x, off_y, off_z));
            cart_geom.vertices.push(new T.Vector3(-off_x, off_y, off_z));

            cart_geom.faceVertexUvs = [ [] ];
        
            let f1_1 = new T.Face3(0, 1, 2);
            cart_geom.faces.push(f1_1);
            cart_geom.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(0,0.3)]);
            let f1_2 = new T.Face3(0, 2, 3);
            cart_geom.faces.push(f1_2);
            cart_geom.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,0.3), new T.Vector2(1,0.3)]);

            let f2_1 = new T.Face3(1, 5, 2);
            cart_geom.faces.push(f2_1);
            cart_geom.faceVertexUvs[0].push([new T.Vector2(1,1), new T.Vector2(0,1), new T.Vector2(1,0)]);
            let f2_2 = new T.Face3(5, 6, 2);
            cart_geom.faces.push(f2_2);
            cart_geom.faceVertexUvs[0].push([new T.Vector2(0,1), new T.Vector2(0,0), new T.Vector2(1,0)]);

            let f3_1 = new T.Face3(2, 6, 3);
            cart_geom.faces.push(f3_1);
            cart_geom.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(0,0.3)]);
            let f3_2 = new T.Face3(6, 7, 3);
            cart_geom.faces.push(f3_2);
            cart_geom.faceVertexUvs[0].push([new T.Vector2(1,0), new T.Vector2(1,0.3), new T.Vector2(0,0.3)]);

            let f4_1 = new T.Face3(1, 4, 5);
            cart_geom.faces.push(f4_1);
            cart_geom.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(0,0.3)]);
            let f4_2 = new T.Face3(1, 0, 4);
            cart_geom.faces.push(f4_2);
            cart_geom.faceVertexUvs[0].push([new T.Vector2(0,0.3), new T.Vector2(1,0.3), new T.Vector2(0,0)]);

            let f5_1 = new T.Face3(7, 4, 0);
            cart_geom.faces.push(f5_1);
            cart_geom.faceVertexUvs[0].push([new T.Vector2(1,0), new T.Vector2(1,1), new T.Vector2(0,1)]);
            let f5_2 = new T.Face3(0, 3, 7);
            cart_geom.faces.push(f5_2);
            cart_geom.faceVertexUvs[0].push([new T.Vector2(0,1), new T.Vector2(0,0), new T.Vector2(1,0)]);
            
            let f6_1 = new T.Face3(4, 6, 5);
            cart_geom.faces.push(f6_1);
            cart_geom.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(0,0.3)]);
            let f6_2 = new T.Face3(4, 7, 6);
            cart_geom.faces.push(f6_2);
            cart_geom.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0.3), new T.Vector2(1,0)]);

            cart_geom.computeFaceNormals();
            cart_geom.uvsNeedUpdate=true;

            let cart_body = new T.Mesh(cart_geom, cart_mat);
            cart.add(cart_body);
            cart_body.position.set(0,0.5,0);
            cart_body.rotateX(Math.PI/2);

            // wheels
            let wheel_mat = train_mat.clone();
            wheel_mat.color = new T.Color("#3b8383");
            for (let j = 0; j < num_wheels; j++) {
                let wheel_geom = new T.CylinderGeometry(0.2,0.2,0.05,8,1,false,0,Math.PI*2);
                let wheel = new T.Mesh(wheel_geom, train_mat);
                cart.add(wheel);
                if (j < num_wheels / 2) {
                    wheel.position.set(0.3, 0.2, -0.5 + j * 0.5);
                    if (j % 3 < 2) {
                        // rods
                        let rod_geom = new T.CylinderGeometry(0.02,0.02,0.5,8,1,false,0,Math.PI*2);
                        let rod = new T.Mesh(rod_geom, rod_mat);
                        cart.add(rod);
                        rod.position.set(0.32,0.2-(j%3-0.5)*0.2,-0.5+j*0.5+0.25);
                        rod.rotateX(Math.PI/2);
                    }
                } else {
                    wheel.position.set(-0.3, 0.2, -0.5 + (j-num_wheels/2) * 0.5);
                    if ((j-num_wheels/2) % 3 < 2) {
                        let rod_geom = new T.CylinderGeometry(0.02,0.02,0.5,8,1,false,0,Math.PI*2);
                        let rod = new T.Mesh(rod_geom, rod_mat);
                        cart.add(rod);
                        rod.position.set(-0.32,0.2-((j-num_wheels/2)%3-0.5)*0.2,-0.5+(j-num_wheels/2)*0.5+0.25);
                        rod.rotateX(Math.PI/2);
                    }
                }
                wheel.rotateZ(Math.PI/2);
            }

            train.add(cart);
        }

        let view = new T.Group();
        let box_geom = new T.BoxGeometry(0.2,0.2,0.2);
        let box = new T.Mesh(box_geom, new T.MeshStandardMaterial());
        view.add(box);
        box.visible = false;
        let ball_geom = new T.SphereGeometry(0.05);
        let ball = new T.Mesh(ball_geom, new T.MeshStandardMaterial());
        ball.position.set(0,0.2,0.2);
        view.add(ball);
        ball.visible = false;
        this.rideable = view;
        train.add(view);
        view.visible = false;

        this.train_body = train;
        this.train_time = 0;
        train_track.add(train);
    }

    /**
     * @param {number} param
     */
    run(param) {
        let param_head = param - 0.03;
        let lengths = this.track.arc_parametrize(); // get the proportions of each segment
        let total = lengths[lengths.length - 1];
        for (let i = 0; i < lengths.length; i++) {
            lengths[i] *= thePoints.length / total;
        }
        // if train head finishes loading
        if (head) {
            if (param_head < 0) param_head += thePoints.length;
            for (let i = 0; i < lengths.length; i++) {
                // console.log(lengths[i]);
                if (param_head < lengths[i]) {
                    param_head -= lengths[i - 1];
                    param_head /= lengths[i] - lengths[i - 1];
                    param_head = param_head / steps + (i - 1) / steps;
                    // console.log(param);
                    break;
                }
            }
            let [pos_x, pos_y, angle] = this.track.get_position_and_angle(param_head);
            head.position.set(pos_x, 0, pos_y);
            head.rotation.y = 3*Math.PI/2-angle;
        }

        let cart_num = 6;
        for (let cart = 0; cart < cart_num; cart++) {
            let param_this = param - (cart + 1) * 0.12;
            if (param_this < 0) param_this += thePoints.length;
            for (let i = 0; i < lengths.length; i++) {
                // console.log(lengths[i]);
                if (param_this < lengths[i]) {
                    param_this -= lengths[i - 1];
                    param_this /= lengths[i] - lengths[i - 1];
                    param_this = param_this / steps + (i - 1) / steps;
                    // console.log(param);
                    break;
                }
            }
            let [pos_x, pos_y, angle] = this.track.get_position_and_angle(param_this);
            this.train_body.children[cart].position.set(pos_x, 0, pos_y);
            this.train_body.children[cart].rotation.y = 3*Math.PI/2-angle;

            if (cart === 2) {
                this.rideable.position.set(pos_x, 0.4, pos_y);
                this.rideable.rotation.y = Math.PI/2-angle;
            }
        }
    }

    /**
     * @param {number} delta
     * @param {any} timeOfDay
     */
    tick(delta,timeOfDay) {
        let speed = 0.0007;
        this.train_time += speed * delta;
        this.run(this.train_time % 8);
    }

    lookFromLookAt() {
        let bbox = new T.Box3();
        bbox.setFromObject(this.objects[0]);
        let x = (bbox.max.x+bbox.min.x)/2;
        let y = (bbox.max.y+bbox.min.y)/2;
        let z = (bbox.max.z+bbox.min.z)/2;

        // make the box a little bigger to deal with think/small objects
        let dx = (bbox.max.x-x) - 3;
        let dy = (bbox.max.y-y) - 3;
        let dz = (bbox.max.z-z) - 3;

        let d = Math.max(dx,dy,dz);

        let fx = x + d*3;
        let fy = y + d*3;
        let fz = z + d*3;

        return [fx,fy,fz,x,y,z];
    }
}
