import sliceFile from "./sliceFile.js";
import test from "node:test";
import assert from "node:assert";
import { existsSync, unlinkSync } from "node:fs";

test("slices model into expected gcode and saves to expected output folder", async () => {
  const existingCubeFile = existsSync("./gcodeFiles/cube.stl.gcode");
  //if cube.stl.gcode already exists in gcodeFiles, delete it.
  //make sure the test isn't affected by the file already existing.
  if (existingCubeFile) {
    unlinkSync("./gcodeFiles/cube.stl.gcode");
  }

  const result = await sliceFile("./test-profile.ini", "./cube.stl");

  const expected = "./gcodeFiles/cube.stl.gcode";
  //result and expected should be matching file paths or the test will fail.
  assert.strictEqual(result, expected);

  //this is checking if the file exists in the gcodeFiles folder
  //test fails if the file doesn't exist.
  assert.ok(existsSync(expected), "Expected G-code file to exist");
});

test("throws an error when given a broken model file", async () => {
  try {
    await sliceFile("./test-profile.ini", "./broken.stl");
    assert.fail("Expected sliceFile to throw an error");
  } catch (error) {
    assert.ok(
      error.message.includes("Loading of a model file failed."),
      "Expected error message to include 'Loading of a model file failed'"
    );
  }
});
