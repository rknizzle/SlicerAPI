import "dotenv/config";
import { exec } from "node:child_process";

const PRUSASLICER_PATH = process.env.SLICER_EXECUTABLE_PATH;

export default function sliceFile(profile_path, model_path) {
  exec(
    `${PRUSASLICER_PATH} --load ${profile_path} -g ${model_path}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );
}
