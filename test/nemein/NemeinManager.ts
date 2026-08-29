import { describe, expect, it } from "vitest";

import {
  I_WALL_KICK_COR_OFFSETS,
  JLSTZ_WALL_KICK_COR_OFFSETS,
  MAX_SPAWNED_TETROMINOS,
  type Tetromino,
  TetrominoManager,
  TetrominoRotateDirection,
  TetrominoRotation,
  TetrominoType,
  WALL_KICK_IMPOSSIBLE_CASE_T_O_INDEX,
  WALL_KICK_IMPOSSIBLE_CASE_T_Z_INDEX,
} from "../../src/core/nemein/TetrominoManager";

describe("TetrominoManager", () => {
  describe("Test initilization", () => {
    const testTetrominoManager = new TetrominoManager();
    const testActiveTetromino = testTetrominoManager.getActiveTetromino();
    const testSpawnedTetrominos =
      testTetrominoManager.getSpawnedTetrominos(false);
    const testHeldTetromino = testTetrominoManager.getHeldTetromino();
    it("Should return a valid active Tetromino", () => {
      expect(
        testActiveTetromino.type !== TetrominoType.Blank &&
          testActiveTetromino.type !== TetrominoType.Ghost,
        "Active Tetromino's type is invalid"
      ).toBe(true);
      expect(
        testActiveTetromino.rotation,
        "Active Tetromino's rotation is invalid"
      ).toBe(TetrominoRotation.O);
    });
    it(`Should return a spawned Tetrominos array of size MAX_SPAWNED_
      TETROMINOS`, () => {
      expect(
        testSpawnedTetrominos,
        "Spawned Tetrominos array does not have correct length"
      ).toHaveLength(MAX_SPAWNED_TETROMINOS);
    });
    it("Should return an empty held Tetromino", () => {
      expect(testHeldTetromino.type, "Held Tetromino's type is invalid").toBe(
        TetrominoType.Blank
      );
      expect(
        testHeldTetromino.rotation,
        "Held Tetromino's rotation is invalid"
      ).toBe(TetrominoRotation.O);
    });
  });

  describe("Test public methods", () => {
    describe("Test setting active Tetromino", () => {
      const testTetrominoManager = new TetrominoManager();
      const testActiveTetrominoToSet: Tetromino = {
        rotation: TetrominoRotation.R,
        type: TetrominoType.T,
      };
      testTetrominoManager.setActiveTetromino(testActiveTetrominoToSet);
      it("Should correctly set an active Tetromino", () => {
        expect(
          testTetrominoManager.getActiveTetromino(),
          "Active Tetromino set is incorrect"
        ).toStrictEqual(testActiveTetrominoToSet);
      });
    });

    describe("Test swapping held Tetromino", () => {
      const testTetrominoManager = new TetrominoManager();
      testTetrominoManager.swapHeldTetromino();
      const testHeldTetromino = testTetrominoManager.getHeldTetromino();
      it("Should correctly swap the held Tetromino", () => {
        expect(
          testHeldTetromino.type !== TetrominoType.Blank &&
            testHeldTetromino.type !== TetrominoType.Ghost,
          "Held Tetromino is not correctly swapped"
        ).toBe(true);
        expect(
          testHeldTetromino.rotation,
          "Held Tetromino's rotation is not correctly set"
        ).toStrictEqual(TetrominoRotation.O);
      });
    });

    describe("Test swapping held Tetromino", () => {
      const testTetrominoManager = new TetrominoManager();
      const testTetrominoToFetch = testTetrominoManager
        .getSpawnedTetrominos(false)
        .at(0);
      const testActiveTetromino = testTetrominoManager.getNewTetromino();
      it(`Should correctly get a new Tetromino and replace the current
        Active Tetromino`, () => {
        expect(
          testActiveTetromino,
          "Active Tetromino differs from the Tetromino to fetch"
        ).toStrictEqual(testTetrominoToFetch);
        expect(
          testTetrominoManager.getSpawnedTetrominos(false).length,
          "Spawned Tetrominos length is not prevserved"
        ).toBe(MAX_SPAWNED_TETROMINOS);
      });
    });

    describe("Test Tetrominos' wall kick offsets", () => {
      it("Should correctly get the wall kick offsets", () => {
        for (
          let type = TetrominoType.Blank;
          type < TetrominoType.NumTetrominoTypes;
          type += 1
        ) {
          for (
            let rotation = TetrominoRotation.O;
            rotation < TetrominoRotation.NumTetrominoRotations;
            rotation += 1
          ) {
            for (
              let direction = TetrominoRotateDirection.Clockwise;
              direction < TetrominoRotateDirection.NumTetrominoDirections;
              direction += 1
            ) {
              const offsets = TetrominoManager.getTetrominoWallKickOffsets(
                type,
                rotation,
                direction
              );
              let cmpOffsets: number[][] = [];
              switch (type) {
                case TetrominoType.Blank:
                  break;
                case TetrominoType.Square:
                  cmpOffsets = [[0, 0]];
                  break;
                case TetrominoType.I:
                  cmpOffsets = structuredClone(
                    I_WALL_KICK_COR_OFFSETS[rotation][direction]
                  );
                  break;
                case TetrominoType.T:
                  cmpOffsets = structuredClone(
                    JLSTZ_WALL_KICK_COR_OFFSETS[rotation][direction]
                  );
                  if (rotation === TetrominoRotation.O) {
                    cmpOffsets.splice(WALL_KICK_IMPOSSIBLE_CASE_T_O_INDEX, 1);
                  } else if (rotation === TetrominoRotation.Z) {
                    cmpOffsets.splice(WALL_KICK_IMPOSSIBLE_CASE_T_Z_INDEX, 1);
                  }
                  break;
                case TetrominoType.J:
                /* Fallthrough */
                case TetrominoType.L:
                /* Fallthrough */
                case TetrominoType.Z:
                /* Fallthrough */
                case TetrominoType.S:
                case TetrominoType.Grey:
                case TetrominoType.Cleared:
                  cmpOffsets = structuredClone(
                    JLSTZ_WALL_KICK_COR_OFFSETS[rotation][direction]
                  );
                  break;
                case TetrominoType.Ghost:
                  break;
                default:
                  break;
              }
              expect(
                offsets,
                `Offsets differ for Tetromino ${type}, rotation ${rotation},
              direction ${direction}`
              ).toStrictEqual(cmpOffsets);
            }
          }
        }
      });
    });
  });
});
