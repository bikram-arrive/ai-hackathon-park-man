import { describe, it, expect } from "vitest";
import {
  DEFAULTS,
  applySignCollection,
  canApplyTurn,
  clampPosition,
  getGridlockCount,
  getIntersectionSnap,
  isAabbIntersect,
  isAtIntersection,
  isRoadCell,
} from "../parkman-logic.js";

describe("road grid rules", () => {
  it("marks cell as road when x index is on road cadence", () => {
    expect(isRoadCell(6, 5)).toBe(true);
  });

  it("marks cell as road when z index is on road cadence", () => {
    expect(isRoadCell(5, 9)).toBe(true);
  });

  it("marks cell as non-road when neither axis is on cadence", () => {
    expect(isRoadCell(5, 7)).toBe(false);
  });

  it("marks origin as road (both coordinates 0)", () => {
    expect(isRoadCell(0, 0)).toBe(true);
  });

  it("handles negative indices correctly", () => {
    expect(isRoadCell(-3, 5)).toBe(true);
    expect(isRoadCell(5, -3)).toBe(true);
    expect(isRoadCell(-3, -3)).toBe(true);
  });

  it("marks cell as road when both are on cadence", () => {
    expect(isRoadCell(6, 9)).toBe(true);
  });

  it("respects custom road cadence parameter", () => {
    expect(isRoadCell(4, 5, 4)).toBe(true);
    expect(isRoadCell(5, 8, 4)).toBe(true);
    expect(isRoadCell(5, 7, 4)).toBe(false);
  });
});

describe("intersection and turning", () => {
  it("snaps to nearest intersection based on cell and cadence", () => {
    const snap = getIntersectionSnap(23, -25);
    expect(snap).toEqual({ x: 24, z: -24, step: 24 });
  });

  it("snaps at exact intersection coordinates", () => {
    const snap = getIntersectionSnap(24, -24);
    expect(snap).toEqual({ x: 24, z: -24, step: 24 });
  });

  it("snaps zero coordinates to origin", () => {
    const snap = getIntersectionSnap(0, 0);
    expect(snap).toEqual({ x: 0, z: 0, step: 24 });
  });

  it("snaps negative coordinates correctly", () => {
    const snap = getIntersectionSnap(-23, -25);
    expect(snap).toEqual({ x: -24, z: -24, step: 24 });
  });

  it("detects near intersection within epsilon", () => {
    const r = isAtIntersection(24.2, -23.8);
    expect(r.near).toBe(true);
    expect(r.snapX).toBe(24);
    expect(r.snapZ).toBe(-24);
  });

  it("detects intersection at exact boundary", () => {
    const r = isAtIntersection(24.34, -24);
    expect(r.near).toBe(true);
  });

  it("does not detect intersection outside epsilon", () => {
    const r = isAtIntersection(24.6, -24.6);
    expect(r.near).toBe(false);
  });

  it("detects intersection at epsilon limit", () => {
    const r = isAtIntersection(24.349, -24);
    expect(r.near).toBe(true);
  });

  it("allows only orthogonal turns and blocks reverse", () => {
    expect(canApplyTurn({ x: 1, y: 0 }, { x: 0, y: -1 })).toBe(true);
    expect(canApplyTurn({ x: 1, y: 0 }, { x: -1, y: 0 })).toBe(false);
    expect(canApplyTurn({ x: 1, y: 0 }, { x: 1, y: 0 })).toBe(false);
  });

  it("allows turn from up to left", () => {
    expect(canApplyTurn({ x: 0, y: -1 }, { x: -1, y: 0 })).toBe(true);
  });

  it("allows turn from down to right", () => {
    expect(canApplyTurn({ x: 0, y: 1 }, { x: 1, y: 0 })).toBe(true);
  });

  it("allows turn from down to left", () => {
    expect(canApplyTurn({ x: 0, y: 1 }, { x: -1, y: 0 })).toBe(true);
  });

  it("blocks diagonal turns", () => {
    expect(canApplyTurn({ x: 1, y: 0 }, { x: 1, y: 1 })).toBe(false);
  });
});

describe("movement bounds", () => {
  it("clamps x and z inside world limits", () => {
    const p = clampPosition(500, -500, DEFAULTS.worldLimit);
    expect(p).toEqual({ x: 95, z: -95 });
  });

  it("does not clamp values within bounds", () => {
    const p = clampPosition(50, -50, DEFAULTS.worldLimit);
    expect(p).toEqual({ x: 50, z: -50 });
  });

  it("clamps zero at boundary", () => {
    const p = clampPosition(0, 0, DEFAULTS.worldLimit);
    expect(p).toEqual({ x: 0, z: 0 });
  });

  it("clamps at positive boundary", () => {
    const p = clampPosition(100, 50, 96);
    expect(p).toEqual({ x: 95, z: 50 });
  });

  it("clamps at negative boundary", () => {
    const p = clampPosition(-150, -80, 96);
    expect(p).toEqual({ x: -95, z: -80 });
  });

  it("clamps both coordinates at boundaries", () => {
    const p = clampPosition(200, -200, 96);
    expect(p).toEqual({ x: 95, z: -95 });
  });

  it("handles values just inside boundary", () => {
    const p = clampPosition(94, -95, 96);
    expect(p).toEqual({ x: 94, z: -95 });
  });
});

describe("AABB collision", () => {
  it("detects overlap", () => {
    const a = { minX: 0, maxX: 2, minY: 0, maxY: 2, minZ: 0, maxZ: 2 };
    const b = { minX: 1, maxX: 3, minY: 1, maxY: 3, minZ: 1, maxZ: 3 };
    expect(isAabbIntersect(a, b)).toBe(true);
  });

  it("detects separation", () => {
    const a = { minX: 0, maxX: 1, minY: 0, maxY: 1, minZ: 0, maxZ: 1 };
    const b = { minX: 2, maxX: 3, minY: 2, maxY: 3, minZ: 2, maxZ: 3 };
    expect(isAabbIntersect(a, b)).toBe(false);
  });

  it("detects edge touching (inclusive boundary)", () => {
    const a = { minX: 0, maxX: 1, minY: 0, maxY: 1, minZ: 0, maxZ: 1 };
    const b = { minX: 1, maxX: 2, minY: 1, maxY: 2, minZ: 1, maxZ: 2 };
    expect(isAabbIntersect(a, b)).toBe(true);
  });

  it("detects one box inside another", () => {
    const a = { minX: 0, maxX: 10, minY: 0, maxY: 10, minZ: 0, maxZ: 10 };
    const b = { minX: 2, maxX: 5, minY: 2, maxY: 5, minZ: 2, maxZ: 5 };
    expect(isAabbIntersect(a, b)).toBe(true);
  });

  it("detects partial overlap on single axis", () => {
    const a = { minX: 0, maxX: 2, minY: 0, maxY: 2, minZ: 0, maxZ: 2 };
    const b = { minX: 3, maxX: 5, minY: 1, maxY: 3, minZ: 1, maxZ: 3 };
    expect(isAabbIntersect(a, b)).toBe(false);
  });

  it("detects overlap on all axes", () => {
    const a = { minX: -5, maxX: 5, minY: -5, maxY: 5, minZ: -5, maxZ: 5 };
    const b = { minX: 0, maxX: 10, minY: 0, maxY: 10, minZ: 0, maxZ: 10 };
    expect(isAabbIntersect(a, b)).toBe(true);
  });

  it("detects no overlap with negative coordinates", () => {
    const a = { minX: -10, maxX: -5, minY: -10, maxY: -5, minZ: -10, maxZ: -5 };
    const b = { minX: 5, maxX: 10, minY: 5, maxY: 10, minZ: 5, maxZ: 10 };
    expect(isAabbIntersect(a, b)).toBe(false);
  });

  it("detects zero-volume intersection (point contact)", () => {
    const a = { minX: 0, maxX: 0, minY: 0, maxY: 1, minZ: 0, maxZ: 1 };
    const b = { minX: 0, maxX: 1, minY: 0, maxY: 1, minZ: 0, maxZ: 1 };
    expect(isAabbIntersect(a, b)).toBe(true);
  });
});

describe("scoring, speed ramp, and gridlock event", () => {
  it("adds 10 points and one sign on each collection", () => {
    const next = applySignCollection({
      score: 0,
      signsCollected: 0,
      baseSpeed: 9,
      gridlockSpawned: false,
      status: "",
    });

    expect(next.score).toBe(10);
    expect(next.signsCollected).toBe(1);
    expect(next.baseSpeed).toBe(9);
    expect(next.gridlockSpawned).toBe(false);
    expect(next.status).toBe("Parking sign acquired");
  });

  it("increases speed by 15% every 5 signs", () => {
    const next = applySignCollection({
      score: 40,
      signsCollected: 4,
      baseSpeed: 10,
      gridlockSpawned: false,
      status: "",
    });

    expect(next.signsCollected).toBe(5);
    expect(next.baseSpeed).toBe(11.5);
  });

  it("increases speed at 10 signs (2nd milestone)", () => {
    const next = applySignCollection({
      score: 90,
      signsCollected: 9,
      baseSpeed: 11.5,
      gridlockSpawned: false,
      status: "",
    });

    expect(next.signsCollected).toBe(10);
    expect(next.baseSpeed).toBe(13.225);
  });

  it("increases speed at 15 signs (3rd milestone)", () => {
    const next = applySignCollection({
      score: 140,
      signsCollected: 14,
      baseSpeed: 13.225,
      gridlockSpawned: false,
      status: "",
    });

    expect(next.signsCollected).toBe(15);
    expect(next.baseSpeed).toBeCloseTo(15.209, 2);
  });

  it("does not increase speed at signs that are not multiples of 5", () => {
    const next = applySignCollection({
      score: 30,
      signsCollected: 3,
      baseSpeed: 10,
      gridlockSpawned: false,
      status: "",
    });

    expect(next.signsCollected).toBe(4);
    expect(next.baseSpeed).toBe(10);
    expect(next.status).toBe("Parking sign acquired");
  });

  it("spawns gridlock once score reaches 100", () => {
    const next = applySignCollection({
      score: 90,
      signsCollected: 9,
      baseSpeed: 9,
      gridlockSpawned: false,
      status: "",
    });

    expect(next.score).toBe(100);
    expect(next.gridlockSpawned).toBe(true);
    expect(next.status).toBe("Gridlock event active");
  });

  it("spawns gridlock at exactly 100 score", () => {
    const next = applySignCollection({
      score: 100,
      signsCollected: 10,
      baseSpeed: 10,
      gridlockSpawned: false,
      status: "",
    });

    expect(next.score).toBe(110);
    expect(next.gridlockSpawned).toBe(true);
  });

  it("keeps gridlock flag true once already active", () => {
    const next = applySignCollection({
      score: 130,
      signsCollected: 13,
      baseSpeed: 12,
      gridlockSpawned: true,
      status: "",
    });

    expect(next.gridlockSpawned).toBe(true);
  });

  it("maintains gridlock status and continues collecting signs", () => {
    const next = applySignCollection({
      score: 150,
      signsCollected: 15,
      baseSpeed: 15,
      gridlockSpawned: true,
      status: "Previous status",
    });

    expect(next.gridlockSpawned).toBe(true);
    expect(next.score).toBe(160);
    expect(next.signsCollected).toBe(16);
    expect(next.status).toBe("Parking sign acquired");
  });

  it("handles large score values", () => {
    const next = applySignCollection({
      score: 1000,
      signsCollected: 100,
      baseSpeed: 50,
      gridlockSpawned: true,
      status: "",
    });

    expect(next.score).toBe(1010);
    expect(next.signsCollected).toBe(101);
  });
});

describe("gridlock obstacle count", () => {
  it("generates between 3 and 5 obstacles", () => {
    expect(getGridlockCount(0.0)).toBe(3);
    expect(getGridlockCount(0.34)).toBe(4);
    expect(getGridlockCount(0.99)).toBe(5);
  });

  it("generates 3 obstacles at minimum", () => {
    expect(getGridlockCount(0.0)).toBe(3);
    expect(getGridlockCount(0.001)).toBe(3);
  });

  it("generates 4 obstacles in middle range", () => {
    expect(getGridlockCount(0.33)).toBe(3);
    expect(getGridlockCount(0.35)).toBe(4);
    expect(getGridlockCount(0.66)).toBe(4);
  });

  it("generates 5 obstacles in high range", () => {
    expect(getGridlockCount(0.67)).toBe(5);
    expect(getGridlockCount(0.99)).toBe(5);
    expect(getGridlockCount(0.999)).toBe(5);
  });

  it("generates 4 at exact boundary (1/3)", () => {
    expect(getGridlockCount(0.333333)).toBe(3);
    expect(getGridlockCount(0.333334)).toBe(4);
  });

  it("generates 5 at exact boundary (2/3)", () => {
    expect(getGridlockCount(0.666666)).toBe(4);
    expect(getGridlockCount(0.666667)).toBe(5);
  });
});
