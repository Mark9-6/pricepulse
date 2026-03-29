import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pythonScriptPath = path.resolve(__dirname, "../../ml-service/predict_price.py");
const pythonCommand = process.env.PYTHON_BIN || "python";

const runPythonPrediction = (items) =>
  new Promise((resolve, reject) => {
    const child = spawn(pythonCommand, [pythonScriptPath], {
      cwd: path.resolve(__dirname, "../../"),
      stdio: ["pipe", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      reject(new Error(`Unable to start Python ML service: ${error.message}`));
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `Python ML service exited with code ${code}`));
        return;
      }

      try {
        const parsed = JSON.parse(stdout);
        resolve(parsed.results ?? []);
      } catch (error) {
        reject(new Error(`Invalid response from Python ML service: ${error.message}`));
      }
    });

    child.stdin.write(JSON.stringify({ items }));
    child.stdin.end();
  });

export const predictPricingInsights = async (items) => runPythonPrediction(items);

export const predictPricingInsight = async (item) => {
  const [result] = await runPythonPrediction([item]);
  return result;
};
