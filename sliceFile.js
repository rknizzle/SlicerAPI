import "dotenv/config";
import { exec } from "node:child_process";

const PRUSASLICER_PATH = process.env.SLICER_EXECUTABLE_PATH;

export default function sliceFile(profile_path, model_path) {
  let model_name = model_path.split("/").pop();

  return new Promise((resolve, reject) => {
    exec(
      `${PRUSASLICER_PATH} --output ./gcodeFiles/${model_name}.gcode --load ${profile_path} -g ${model_path}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(error);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        resolve(`./gcodeFiles/${model_name}.gcode`);
      }
    );
  });
}
