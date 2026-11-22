import { level0 } from "./lessons/level0";
import { level1 } from "./lessons/level1";
import { level2 } from "./lessons/level2";
import { level3 } from "./lessons/level3";
import { level4 } from "./lessons/level4";
import { level5 } from "./lessons/level5";
import { level6 } from "./lessons/level6";
import { level7 } from "./lessons/level7";
import { level8 } from "./lessons/level8";
import type { Level } from "./types";

export const LEVELS: Level[] = [
  level0,
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
];
export function getLevel(slug: string): Level | undefined {
  return LEVELS.find((l) => l.slug === slug);
}
