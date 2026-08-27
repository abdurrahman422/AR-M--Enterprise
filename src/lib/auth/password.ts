import "server-only";

import { timingSafeEqual } from "node:crypto";

export function passwordsMatch(provided: string, expected: string): boolean {
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);

  if (left.length !== right.length) {
    timingSafeEqual(right, right);
    return false;
  }

  return timingSafeEqual(left, right);
}
