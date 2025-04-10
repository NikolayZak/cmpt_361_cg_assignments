import { Mat4, Vec4 } from './math.js';
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

const cube = {
  positions: [
    // Front face (z = +0.5)
    -1, -1,  1,
     1, -1,  1,
     1,  1,  1,
    -1, -1,  1,
     1,  1,  1,
    -1,  1,  1,

    // Back face (z = -0.5)
    -1, -1, -1,
    -1,  1, -1,
     1,  1, -1,
    -1, -1, -1,
     1,  1, -1,
     1, -1, -1,

    // Left face (x = -1)
    -1, -1, -1,
    -1, -1,  1,
    -1,  1,  1,
    -1, -1, -1,
    -1,  1,  1,
    -1,  1, -1,

    // Right face (x = +1)
     1, -1, -1,
     1,  1, -1,
     1,  1,  1,
     1, -1, -1,
     1,  1,  1,
     1, -1,  1,

    // Top face (y = +1)
    -1,  1, -1,
    -1,  1,  1,
     1,  1,  1,
    -1,  1, -1,
     1,  1,  1,
     1,  1, -1,

    // Bottom face (y = -1)
    -1, -1, -1,
     1, -1, -1,
     1, -1,  1,
    -1, -1, -1,
     1, -1,  1,
    -1, -1,  1
  ],

  normals: [
    // Front
    0, 0, 1,  0, 0, 1,  0, 0, 1,
    0, 0, 1,  0, 0, 1,  0, 0, 1,

    // Back
    0, 0, -1,  0, 0, -1,  0, 0, -1,
    0, 0, -1,  0, 0, -1,  0, 0, -1,

    // Left
    -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
    -1, 0, 0,  -1, 0, 0,  -1, 0, 0,

    // Right
    1, 0, 0,  1, 0, 0,  1, 0, 0,
    1, 0, 0,  1, 0, 0,  1, 0, 0,

    // Top
    0, 1, 0,  0, 1, 0,  0, 1, 0,
    0, 1, 0,  0, 1, 0,  0, 1, 0,

    // Bottom
    0, -1, 0,  0, -1, 0,  0, -1, 0,
    0, -1, 0,  0, -1, 0,  0, -1, 0
  ],

  uvCoords: [
    // Front
    0, 0,  1, 0,  1, 1,
    0, 0,  1, 1,  0, 1,

    // Back
    0, 0,  1, 1,  1, 0,
    0, 0,  0, 1,  1, 1,

    // Left
    0, 0,  1, 0,  1, 1,
    0, 0,  1, 1,  0, 1,

    // Right
    0, 0,  1, 1,  1, 0,
    0, 0,  0, 1,  1, 1,

    // Top
    0, 0,  1, 0,  1, 1,
    0, 0,  1, 1,  0, 1,

    // Bottom
    0, 0,  1, 1,  1, 0,
    0, 0,  0, 1,  1, 1
  ]
}


TriangleMesh.prototype.createCube = function() {
  // TODO: populate unit cube vertex positions, normals, and uv coordinates
  this.positions = cube.positions;
  this.normals = cube.normals;
  this.uvCoords = cube.uvCoords;
}

TriangleMesh.prototype.createSphere = function(numStacks, numSectors) {
  // TODO: populate unit sphere vertex positions, normals, uv coordinates, and indices
  this.positions = quad.positions.slice(0, 9).map(p => p * 0.5);
  this.normals = quad.normals.slice(0, 9);
  this.uvCoords = quad.uvCoords.slice(0, 6);
  this.indices = [0, 1, 2];
}

Scene.prototype.computeTransformation = function(transformSequence) {
  // TODO: go through transform sequence and compose into overallTransform
  let overallTransform = Mat4.create();  // identity matrix
  
  
  let T = [];
  let R = [];
  let S = [];

  // sort the transformations into their 3 types
  for(let transform of transformSequence){
    switch (transform[0]) {
      case "T":
        T.push(transform);
        break;

      case "Rx":
      case "Ry":
      case "Rz":
        R.push(transform);
        break;

      case "S":
        S.push(transform);
        break;
      default:
        break;
    }
  }

  let current = Mat4.create();
  // Apply Translations in order
  for(let translation of T){
    const tx = translation[1];
    const ty = translation[2];
    const tz = translation[3];
    Mat4.set(current,1,0,0,tx,
                     0,1,0,ty,
                     0,0,1,tz,
                     0,0,0,1);
    Mat4.multiply(overallTransform, current, overallTransform);
  }

  // Apply Rotations
  for(let rotation of R){
    const cs = Math.cos(rotation[1] * Math.PI / 180);
    const s = Math.sin(rotation[1] * Math.PI / 180);
    switch (rotation[0]) {
      case "Rx":
        Mat4.set(current,1,0,0,0,
                         0,cs,s,0,
                         0,-s,cs,0,
                         0,0,0,1);
        break;
      case "Ry":
        Mat4.set(current,cs,0,s,0,
                         0,1,0,0,
                         -s,0,cs,0,
                         0,0,0,1);
        break;
      case "Rz":
        Mat4.set(current,cs,-s,0,0,
                         s,cs,0,0,
                         0,0,1,0,
                         0,0,0,1);
        break;
      default:
        break;
    }
    Mat4.multiply(overallTransform, current, overallTransform);
  }

  // Apply Scaling
  for(let scale of S){
    const sx = scale[1];
    const sy = scale[2];
    const sz = scale[3];
    Mat4.set(current,sx,0,0,0,
                     0,sy,0,0,
                     0,0,sz,0,
                     0,0,0,1);
    Mat4.multiply(overallTransform, current, overallTransform);
  }
  console.log(overallTransform);
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
