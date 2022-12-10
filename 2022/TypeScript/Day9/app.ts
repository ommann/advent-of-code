import { readFileSync } from "fs";
import { cloneDeep } from "lodash";

const stepsN = readFileSync("input.txt", "utf8").split("\n")
  .map(e => e.split(" "))
  .map(e => [e[0], +e[1]] as [string, number]);

const steps = stepsN.flatMap(([step, times]) => Array(times).fill(step));

interface Coordinate {
  x: number;
  y: number;
}

let head = { x: 0, y: 0 };
let tail = { x: 0, y: 0 };

const difference = (a: Coordinate, b: Coordinate): [number, number] => [a.x - b.x, a.y - b.y];

// Moves A towards B by one step if A and B are not touching, returns new B
function pull(a: Coordinate, b: Coordinate): Coordinate {
  b = { ...b };

  const [dx, dy] = difference(a, b);

  // If difference is more than 1, move the B one step closer to A
  if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
    b.x += Math.sign(dx);
    b.y += Math.sign(dy);
  }

  return b;
}

function move(direction: string, knots: Coordinate[]): Coordinate[] {
  knots = cloneDeep(knots);
  head = knots[0];

  if (direction === "U") { head.y+= 1; }
  if (direction === "D") { head.y-= 1; } 
  if (direction === "L") { head.x-= 1; } 
  if (direction === "R") { head.x+= 1; }

  for (let i = 1; i < knots.length; i++) {
    knots[i] = pull(knots[i-1], knots[i]);
  }

  return knots;
}

let trail: { [key: string]: boolean } = { "0,0": true };

for (const step of steps) {
  [head, tail] = move(step, [head, tail]);

  const key = `${tail.x},${tail.y}`;
  trail[key] = true;
}

console.log("Part 1:", Object.keys(trail).length); // 5981

// Part 2 //

let knots = [0,1,2,3,4,5,6,7,8,9].map(() => ({ x: 0, y: 0 }));
trail = { "0,0": true };

for (const step of steps) {
  knots = move(step, knots);

  const key = `${knots[9].x},${knots[9].y}`;
  trail[key] = true;
}

console.log("Part 2:", Object.keys(trail).length); // 2352
