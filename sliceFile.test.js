import sliceFile from "./sliceFile.js";
import test from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";

test("slices model into expected gcode and saves to expected output folder", async () => {
  const result = await sliceFile("./test-profile.ini", "./cube.stl");
  const folderPath = "./gcodeFiles";
  const gcodeFiles = fs.readdirSync(folderPath);
  const file = gcodeFiles.find((file) => file === "cube.stl.gcode");

  //path.join removes the leading ./ so I am adding it back
  const filePath = file ? `./${path.join(folderPath, file)}` : undefined;

  assert.strictEqual(result, filePath);
});

//TODO:
//Create another test that when given a broken model file throws an error.
//assert threw an error. error message contains Loading of a model file failed.
