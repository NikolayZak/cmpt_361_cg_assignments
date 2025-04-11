import { Mat4 } from './math.js';
import { Parser } from './parser.js';
import { Scene } from './scene.js';
import { Renderer } from './renderer.js';
import { TriangleMesh } from './trianglemesh.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement createCube, createSphere, computeTransformation, and shaders
////////////////////////////////////////////////////////////////////////////////

// Example two triangle quad
const quad = {
  positions: [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1,  1, -1, -1,  1, -1],
  normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  uvCoords: [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]
}


TriangleMesh.prototype.createCube = function() {
  this.positions = [
    // front
    -1, -1, 1,
     1, -1, 1,
     1, 1, 1,
    -1, 1, 1,

    // back
    -1, -1, -1,
    -1, 1, -1,
     1, 1, -1,
     1, -1, -1,

    // left
    -1, -1, -1,
    -1, -1, 1,
    -1, 1, 1,
    -1, 1, -1,

    // right
    1, -1, -1,
    1, 1, -1,
    1, 1, 1,
    1, -1, 1,

    // top
    -1, 1, -1,
    -1, 1, 1,
     1, 1, 1,
     1, 1, -1,

    // bottom
    -1, -1, -1,
     1, -1, -1,
     1, -1, 1,
    -1, -1, 1
  ];

  this.indices = [
   0, 1, 2,  0, 2, 3, // front
   4, 5, 6,  4, 6, 7, // back
   8, 9,10,  8,10,11, // left
   12,13,14, 12,14,15, // right
   16,17,18, 16,18,19, // top
   20,21,22, 20,22,23  // bottom
  ];

  this.normals = [
    // front
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

   // back
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,

    // left
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,

    // right
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // top
     0, 1, 0,
     0, 1, 0,
     0, 1, 0,
     0, 1, 0,

    // bottom
     0, -1, 0,
     0, -1, 0,
     0, -1, 0,
     0, -1, 0
  ];

  this.uvCoords = [
    // same uvCoords for all sides
    0, 0,
    1, 0,
    1, 1,
    0, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 1
  ];
}


TriangleMesh.prototype.createSphere = function(numStacks, numSectors) {
  this.positions = [];
  this.normals = [];
  this.uvCoords = [];
  this.indices = [];

  for(let i = 0; i <= numStacks; i++){ // for each stack
    let y_angle = Math.PI * (i / numStacks); // vertical from 0 to PI
    let r = Math.sin(y_angle);
    let y = Math.cos(y_angle);

    for(let j = 0; j <= numSectors; j++){ // horizontally from 0 to 2PI
      let x_angle = 2 * Math.PI * (j / numSectors);
      let x = r * Math.cos(x_angle);
      let z = r * Math.sin(x_angle);
      // add vertex
      this.positions.push(x, y, z);
      // add normal
      this.normals.push(x, y, z);
      // add uv projection
      this.uvCoords.push(j / numSectors, 1 - i / numStacks);

      // first index
      const first = i * (numSectors + 1) + j;
      // second index
      const second = first + numSectors + 1;

      // first triangle of the section
      this.indices.push(first, second, first + 1);
      // second triangle of the section
      this.indices.push(second, second + 1, first + 1);
    }
  }
}

Scene.prototype.computeTransformation = function(transformSequence) {
  // TODO: go through transform sequence and compose into overallTransform
  let overallTransform = Mat4.create();  // identity matrix
  let current = Mat4.create();
  
  for(let transform of transformSequence){
    let t1 = transform[1];
    let t2 = transform[2];
    let t3 = transform[3];
    let s = Math.sin(t1 * Math.PI / 180);
    let c = Math.cos(t1 * Math.PI / 180);
    switch (transform[0]) {
      case "T":
        Mat4.set(current,1,0,0,0,
                         0,1,0,0,
                         0,0,1,0,
                        t1,t2,t3,1);
        break;

      case "Rx":
        Mat4.set(current,1,0,0,0,
                         0,c,-s,0,
                         0,s,c,0,
                        0,0,0,1);
        break;

      case "Ry":
        Mat4.set(current,c,0,s,0,
                         0,1,0,0,
                         -s,0,c,0,
                         0,0,0,1);
        break;

      case "Rz":
        Mat4.set(current,c,s,0,0,
                         -s,c,0,0,
                          0,0,1,0,
                         0,0,0,1);
        break;

      case "S":
        Mat4.set(current,t1,0,0,0,
                         0,t2,0,0,
                         0,0,t3,0,
                         0,0,0,1);
        break;

      default:
        break;
    }
    Mat4.multiply(overallTransform, current, overallTransform);
  }
  return overallTransform;
}

Renderer.prototype.VERTEX_SHADER = `
precision mediump float;
attribute vec3 position, normal;
attribute vec2 uvCoord;
uniform vec3 lightPosition;
uniform mat4 projectionMatrix, viewMatrix, modelMatrix;
uniform mat3 normalMatrix;
varying vec2 vTexCoord;

// TODO: implement vertex shader logic below

varying vec3 temp;

void main() {
  temp = vec3(position.x, normal.x, uvCoord.x);
  vTexCoord = uvCoord;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;

Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;
uniform sampler2D uTexture;
uniform bool hasTexture;
varying vec2 vTexCoord;

// TODO: implement fragment shader logic below

varying vec3 temp;

void main() {
  gl_FragColor = vec4(temp, 1.0);
}
`;

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "c,myCamera,perspective,5,5,5,0,0,0,0,1,0;",
  "l,myLight,point,0,5,0,2,2,2;",
  "p,unitCube,cube;",
  "p,unitSphere,sphere,20,20;",
  "m,redDiceMat,0.3,0,0,0.7,0,0,1,1,1,15,dice.jpg;",
  "m,grnDiceMat,0,0.3,0,0,0.7,0,1,1,1,15,dice.jpg;",
  "m,bluDiceMat,0,0,0.3,0,0,0.7,1,1,1,15,dice.jpg;",
  "m,globeMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5,globe.jpg;",
  "o,rd,unitCube,redDiceMat;",
  "o,gd,unitCube,grnDiceMat;",
  "o,bd,unitCube,bluDiceMat;",
  "o,gl,unitSphere,globeMat;",
  "X,rd,Rz,75;X,rd,Rx,90;X,rd,S,0.5,0.5,0.5;X,rd,T,-1,0,2;",
  "X,gd,Ry,45;X,gd,S,0.5,0.5,0.5;X,gd,T,2,0,2;",
  "X,bd,S,0.5,0.5,0.5;X,bd,Rx,90;X,bd,T,2,0,-1;",
  "X,gl,S,1.5,1.5,1.5;X,gl,Rx,90;X,gl,Ry,-150;X,gl,T,0,1.5,0;",
].join("\n");

// DO NOT CHANGE ANYTHING BELOW HERE
export { Parser, Scene, Renderer, DEF_INPUT };
