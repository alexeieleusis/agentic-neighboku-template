import { describe, expect, it } from "vitest";
import type { FaceSwatchBoardState } from "../FaceSwatchBoard.types";
import {
  canDropTile,
  dropTile,
  faceTileImageSrc,
  returnSlotTile,
} from "../useFaceSwatchBoardDomain";

const emptySlotState = {
  trayTileIds: ["h0e0m0", "h1e1m1"],
  slotTileId: null,
} satisfies FaceSwatchBoardState;

const occupiedState = {
  ...emptySlotState,
  slotTileId: "h1e1m1",
} satisfies FaceSwatchBoardState;

const filledState = {
  trayTileIds: ["h1e1m1"],
  slotTileId: "h0e0m0",
} satisfies FaceSwatchBoardState;

const canDropTileTests = [
  {
    name: "allows dropping a tray tile into an empty slot",
    run: () => expect(canDropTile(emptySlotState, "h0e0m0")).toBe(true),
  },
  {
    name: "refuses to drop a tile the tray doesn't have",
    run: () => expect(canDropTile(emptySlotState, "h2e2m2")).toBe(false),
  },
  {
    name: "refuses to drop into an occupied slot",
    run: () => expect(canDropTile(occupiedState, "h0e0m0")).toBe(false),
  },
];

const dropTileTests = [
  {
    name: "moves a tile from tray to slot",
    run: () =>
      expect(dropTile(emptySlotState, "h0e0m0")).toEqual({
        trayTileIds: ["h1e1m1"],
        slotTileId: "h0e0m0",
      }),
  },
  {
    name: "is a no-op when the drop is illegal",
    run: () => expect(dropTile(occupiedState, "h0e0m0")).toBe(occupiedState),
  },
];

const returnSlotTileTests = [
  {
    name: "returns the slot tile to the tray",
    run: () =>
      expect(returnSlotTile(filledState)).toEqual({
        trayTileIds: ["h1e1m1", "h0e0m0"],
        slotTileId: null,
      }),
  },
  {
    name: "is a no-op when the slot is already empty",
    run: () => expect(returnSlotTile(emptySlotState)).toBe(emptySlotState),
  },
];

const faceTileImageSrcTests = [
  {
    name: "builds the public face image path",
    run: () => expect(faceTileImageSrc("h0e1m2")).toBe("/faces/h0e1m2.png"),
  },
];

describe("FaceSwatchBoard domain", () => {
  for (const tc of canDropTileTests) it(tc.name, tc.run);
  for (const tc of dropTileTests) it(tc.name, tc.run);
  for (const tc of returnSlotTileTests) it(tc.name, tc.run);
  for (const tc of faceTileImageSrcTests) it(tc.name, tc.run);
});
