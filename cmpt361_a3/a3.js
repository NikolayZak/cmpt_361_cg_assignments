import { Framebuffer } from './framebuffer.js';
import { Rasterizer } from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement functions drawLine(v1, v2) and drawTriangle(v1, v2, v3) below.
////////////////////////////////////////////////////////////////////////////////


// returns the mix of colours (strenght = 1 is just c1)
function LineColour([r1, g1, b1], [r2, g2, b2], strenght){
  return [(r1 * strenght + r2 * (1 - strenght)), (g1 * strenght + g2 * (1 - strenght)), (b1 * strenght + b2 * (1 - strenght))]
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
      for(let i = 0; i < Math.abs(y_diff) + 1; i++){ // y1 is the starting index
        yi = y1 + i;
        strenght = 1 - (i / distance);
        this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c1, c2, strenght));
      }
    }else{
      for(let i = 0; i < Math.abs(y_diff) + 1; i++){ // y1 is the starting index
        yi = y2 + i;
        strenght = 1 - (i / distance);
        this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c2, c1, strenght));
      }
    }
    return;
  }

  if(y_diff == 0){ // Case 1.5: horizontal line
    distance = Math.abs(x_diff);
    yi = y1;
    if(x1 < x2){
      for(let i = 0; i < Math.abs(x_diff) + 1; i++){ // y1 is the starting index
        xi = x1 + i;
        strenght = 1 - (i / distance);
        this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c1, c2, strenght));
      }
    }else{
      for(let i = 0; i < Math.abs(x_diff) + 1; i++){ // y1 is the starting index
        xi = x2 + i;
        strenght = 1 - (i / distance);
        this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c2, c1, strenght));
      }
    }
    return;
  }

  let slope = y_diff / x_diff;

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
          yi = y2 + i;
          xi = x2 + (i / slope); // i * inverse slope
          strenght = 1 - (i / distance);
          this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c2, c1, strenght));
        }
      }else{// Case 2-B-2: Quadrant 3, Small Slope
        distance = Math.abs(x_diff);
        for(let i = 0; i < Math.abs(x_diff) + 1; i++){
          xi = x2 + i;
          yi = y2 + (i * slope); // i * slope
          strenght = 1 - (i / distance);
          this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c2, c1, strenght));
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
          yi = y2 - i;
          xi = x2 - (i / slope); // i * inverse slope
          strenght = 1 - (i / distance);
          this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c2, c1, strenght));
        }
      }else{// Case 3-B-2: Quadrant 2, Small Slope
        distance = Math.abs(x_diff);
        for(let i = 0; i < Math.abs(x_diff) + 1; i++){
          xi = x2 + i;
          yi = y2 + (i * slope); // i * slope
          strenght = 1 - (i / distance);
          this.setPixel(Math.floor(xi), Math.floor(yi), LineColour(c2, c1, strenght));
        }
      }
    }
  }
}

// take 3 vertices defining a solid triangle and rasterize to framebuffer
Rasterizer.prototype.drawTriangle = function(v1, v2, v3) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;
  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw triangle
  this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
  this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);
  this.setPixel(Math.floor(x3), Math.floor(y3), [r3, g3, b3]);
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
