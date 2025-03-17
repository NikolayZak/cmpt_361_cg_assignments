import { Framebuffer } from './framebuffer.js';
import { Rasterizer } from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement functions drawLine(v1, v2) and drawTriangle(v1, v2, v3) below.
////////////////////////////////////////////////////////////////////////////////


// returns the mix of colours (strenght = 1 is just c1)
function LineColour([r1, g1, b1], [r2, g2, b2], strenght){
  return [(r1 * strenght + r2 * (1 - strenght)), (g1 * strenght + g2 * (1 - strenght)), (b1 * strenght + b2 * (1 - strenght))];
}

// take two vertices defining line and rasterize to framebuffer
Rasterizer.prototype.drawLine = function(v1, v2) {
  const [x1, y1, c1] = v1;
  const [x2, y2, c2] = v2;

  let x_diff = x2 - x1;
  let y_diff = y2 - y1;
  let distance;
  let xi;
  let yi;
  let strenght;

  if(x_diff == 0){ // Case 1: vertical line
    if(y_diff == 0){ // Edge Case: vertices are the same -> blend colours
      this.setPixel(Math.floor(x1), Math.floor(y1), LineColour(c1, c2, 0.5));
      return;
    }

    distance = Math.abs(y_diff);
    xi = x1;
    if(y1 < y2){
      for(let i = 0; i < Math.abs(y_diff) + 1; i++){
        yi = y1 + i;
        strenght = 1 - (i / distance);
        this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c1, c2, strenght));
      }
    }else{
      for(let i = 0; i < Math.abs(y_diff) + 1; i++){
        yi = y1 - i;
        strenght = 1 - (i / distance);
        this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c1, c2, strenght));
      }
    }
    return;
  }

  if(y_diff == 0){ // Case 1.5: horizontal line
    distance = Math.abs(x_diff);
    yi = y1;
    if(x1 < x2){
      for(let i = 0; i < Math.abs(x_diff) + 1; i++){
        xi = x1 + i;
        strenght = 1 - (i / distance);
        this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c1, c2, strenght));
      }
    }else{
      for(let i = 0; i < Math.abs(x_diff) + 1; i++){
        xi = x1 - i;
        strenght = 1 - (i / distance);
        this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c1, c2, strenght));
      }
    }
    return;
  }

  let slope = y_diff / x_diff;

  // Case: Sloped Line
  if(slope > 0){// Case 2: Quadrant 1 or Quadrant 3
    if(x_diff > 0){ // Case 2-A: Quadrant 1
      if(slope > 1){ // Case 2-A-1: Quadrant 1, Steep Slope
        distance = Math.abs(y_diff);
        for(let i = 0; i < Math.abs(y_diff) + 1; i++){
          yi = y1 + i;
          xi = x1 + (i / slope); // i * inverse slope
          strenght = 1 - (i / distance);
          this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c1, c2, strenght));
        }
      }else{// Case 2-A-2: Quadrant 1, Small Slope
        distance = Math.abs(x_diff);
        for(let i = 0; i < Math.abs(x_diff) + 1; i++){
          xi = x1 + i;
          yi = y1 + (i * slope); // i * slope
          strenght = 1 - (i / distance);
          this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c1, c2, strenght));
        }
      }
    }else{ // Case 2-B: Quadrant 3
      if(slope > 1){ // Case 2-B-1: Quadrant 3, Steep Slope
        distance = Math.abs(y_diff);
        for(let i = 0; i < Math.abs(y_diff) + 1; i++){
          yi = y1 - i;
          xi = x1 - (i / slope); // i * inverse slope
          strenght = 1 - (i / distance);
          this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c1, c2, strenght));
        }
      }else{// Case 2-B-2: Quadrant 3, Small Slope
        distance = Math.abs(x_diff);
        for(let i = 0; i < Math.abs(x_diff) + 1; i++){
          xi = x1 - i;
          yi = y1 - (i * slope); // i * slope
          strenght = 1 - (i / distance);
          this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c1, c2, strenght));
        }
      }
    }
  }else{ // Case 3: Quadrant 2 or Quadrant 4
    if(x_diff > 0){ // Case 3-A: Quadrant 4
      if(slope < -1){ // Case 3-A-1: Quadrant 4, Steep Slope
        distance = Math.abs(y_diff);
        for(let i = 0; i < Math.abs(y_diff) + 1; i++){
          yi = y1 - i;
          xi = x1 - (i / slope); // i * inverse slope
          strenght = 1 - (i / distance);
          this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c1, c2, strenght));
        }
      }else{// Case 3-A-2: Quadrant 4, Small Slope
        distance = Math.abs(x_diff);
        for(let i = 0; i < Math.abs(x_diff) + 1; i++){
          xi = x1 + i;
          yi = y1 + (i * slope); // i * slope
          strenght = 1 - (i / distance);
          this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c1, c2, strenght));
        }
      }
    }else{ // Case 3-B: Quadrant 2
      if(slope < -1){ // Case 3-B-1: Quadrant 2, Steep Slope
        distance = Math.abs(y_diff);
        for(let i = 0; i < Math.abs(y_diff) + 1; i++){
          yi = y1 + i;
          xi = x1 + (i / slope); // i * inverse slope
          strenght = 1 - (i / distance);
          this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c1, c2, strenght));
        }
      }else{// Case 3-B-2: Quadrant 2, Small Slope
        distance = Math.abs(x_diff);
        for(let i = 0; i < Math.abs(x_diff) + 1; i++){
          xi = x1 - i;
          yi = y1 - (i * slope); // i * slope
          strenght = 1 - (i / distance);
          this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c1, c2, strenght));
        }
      }
    }
  }
}

// Computes counter clockwise area
function Triangle_Equation(x0, y0, x1, y1, xp, yp) {
  return (y1 - y0) * (xp - x0) - (x1 - x0) * (yp - y0);
}

function UVC_Colour(u, v, w, [r1, g1, b1], [r2, g2, b2], [r3, g3, b3]){
  let rp = u * r1 + v * r2 + w * r3;
  let gp = u * g1 + v * g2 + w * g3;
  let bp = u * b1 + v * b2 + w * b3;
  return [rp, gp, bp];
}

// take 3 vertices defining a solid triangle and rasterize to framebuffer
Rasterizer.prototype.drawTriangle = function(v1, v2, v3) {
  let [x1, y1, c1] = v1;
  let [x2, y2, c2] = v2;
  let [x3, y3, c3] = v3;

  // Edge Case: Vertical line
  let vertices;
  if(x1 == x2 && x1 == x3){
    vertices = [v1, v2, v3];
    vertices.sort((a, b) => a[1] - b[1]);
    this.drawLine(vertices[0], vertices[1]);
    this.drawLine(vertices[1], vertices[2]);
    return;
  }

  // Edge Case: Horizontal line
  if(y1 == y2 && y1 == y3){
    vertices = [v1, v2, v3];
    vertices.sort((a, b) => a[0] - b[0]);
    this.drawLine(vertices[0], vertices[1]);
    this.drawLine(vertices[1], vertices[2]);
    return;
  }

  // 2 points are the same
  if((x1 == x2 && y1 == y2) || (x2 == x3 && y2 == y3) || (x1 == x3 && y1 == y3)){
    vertices = [v1, v2, v3];
    vertices.sort((a, b) => a[0] - b[0]);
    
    // 3 points are the same
    if(vertices[0][0] == vertices[2][0] && vertices[0][1] == vertices[2][1]){
      let rx = c1[0]/3 + c2[0]/3 + c3[0]/3;
      let gx = c1[1]/3 + c2[1]/3 + c3[1]/3;
      let bx = c1[2]/3 + c2[2]/3 + c3[2]/3;
      this.setPixel(Math.floor(x1), Math.floor(y1), [rx,gx,bx]);
      return;
    }
    this.drawLine(vertices[0], vertices[1]);
    this.drawLine(vertices[1], vertices[2]);
    return;
  }

  // make a swap if needed to ensure counter clockwise order
  if(Triangle_Equation(x1,y1,x2,y2,x3,y3) < 0){
    [x2, y2, c2] = v3;
    [x3, y3, c3] = v2;
  }

  // search box
  let x_min = Math.min(x1, x2, x3);
  let y_min = Math.min(y1, y2, y3);
  let x_max = Math.max(x1, x2, x3);
  let y_max = Math.max(y1, y2, y3);

  // variables
  let A = Triangle_Equation(x1,y1,x2,y2,x3,y3);
  let a1;
  let a2;
  let a3;
  let u;
  let v;
  let w;
  
  for(let i = x_min; i <= x_max; i++){
    for(let j = y_min; j <= y_max; j++){
      // first side
      a1 = Triangle_Equation(x2, y2, x3, y3, i, j);
      if(a1 < 0){ // Case: (i,j) not in triangle
        continue;
      }
      // second side
      a2 = Triangle_Equation(x3, y3, x1, y1, i, j);
      if(a2 < 0){ // Case: (i,j) not in triangle
        continue;
      }
      // third side
      a3 = Triangle_Equation(x1, y1, x2, y2, i, j);
      if(a3 < 0){ // Case: (i,j) not in triangle
        continue;
      }
      // Point (i, j) is inside the triangle

      // edge cases
      if(a1 == 0){
        if(y2 < y3 || (y2 == y3 && x2 > x3)){
          continue;
        }
      }
      if(a2 == 0){
        if(y3 < y1 || (y3 == y1 && x3 > x1)){
          continue;
        }
      }
      if(a3 == 0){
        if(y1 < y2 || (y1 == y2 && x1 > x2)){
          continue;
        }
      }

      // Colour the pixel
      u = a1 / A;
      v = a2 / A;
      w = a3 / A;
      this.setPixel(Math.floor(i), Math.floor(j), UVC_Colour(u, v, w, c1, c2, c3));
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "v,10,10,1.0,0.0,0.0;",
  "v,52,52,0.0,1.0,0.0;",
  "v,52,10,0.0,0.0,1.0;",
  "v,10,52,1.0,1.0,1.0;",
  "t,0,1,2;",
  "t,0,3,1;",
  "v,10,10,1.0,1.0,1.0;",
  "v,10,52,0.0,0.0,0.0;",
  "v,52,52,1.0,1.0,1.0;",
  "v,52,10,0.0,0.0,0.0;",
  "l,4,5;",
  "l,5,6;",
  "l,6,7;",
  "l,7,4;"
].join("\n");


// DO NOT CHANGE ANYTHING BELOW HERE
export { Rasterizer, Framebuffer, DEF_INPUT };
