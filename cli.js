import readline from "readline";
import { spawn } from "child_process";
import * as path from "path";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function runCommand(command) {
  const childProcess = spawn("npm", ["run", command]);
  childProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  childProcess.on("close", (code) => {
    console.log(`Child process exited with code ${code}`);
    startCLI();
  });
}

function startCLI() {
  rl.question(
    "\nPress \n 1] run without coordination, \n 2] run with coordination  \n 0] to exit \n",
    (answer) => {
      if (answer === "1") {
        runCommand("start-without-coordinate");
      } else if (answer === "2") {
        runCommand("start-with-coordinate");
      } else if (answer === "0") {
        console.log("Exiting CLI.");
        rl.close();
      } else {
        console.log("\n Invalid choice. Please press 1, 2, or 0.");
        startCLI();
      }
    }
  );
}

startCLI();
