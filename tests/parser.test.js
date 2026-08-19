import test from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function runParser(filePath) {
  const input = readFileSync(filePath, "utf8");

  return spawnSync("node", ["app.js"], {
    input,
    encoding: "utf8",
  });
}

test("Step 1 - valid JSON exits with code 0", () => {
  const result = runParser("step1/valid.json");

  assert.strictEqual(result.status, 0);
});

test("Step 1 - invalid JSON exits with code 1", () => {
  const result = runParser("step1/invalid.json");

  assert.strictEqual(result.status, 1);
});

test("Step 2 - valid JSON exits with code 0", () => {
  const result = runParser("step2/valid.json");

  assert.strictEqual(result.status, 0);
});

test("Step 2 - valid JSON exits with code 0", () => {
  const result = runParser("step2/valid2.json");

  assert.strictEqual(result.status, 0);
});

test("Step 2 - invalid JSON exits with code 1", () => {
  const result = runParser("step2/invalid.json");

  assert.strictEqual(result.status, 1);
});

test("Step 2 - invalid JSON exits with code 1", () => {
  const result = runParser("step2/invalid2.json");

  assert.strictEqual(result.status, 1);
});

test("Step 3 - valid JSON exits with code 0", () => {
  const result = runParser("step3/valid.json");

  assert.strictEqual(result.status, 0);
});

test("Step 3 - invalid JSON exits with code 1", () => {
  const result = runParser("step3/invalid.json");

  assert.strictEqual(result.status, 1);
});
