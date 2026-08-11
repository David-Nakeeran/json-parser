#!/usr/bin/env node
"use strict";

import { argv } from "node:process";
import process from "node:process";

const tokenTypes = [
  { type: "LEFT_BRACE", symbol: "{" },
  { type: "RIGHT_BRACE", symbol: "}" },
];

function lexer(input) {
  const tokens = [];

  [...input].forEach((element) => {
    tokenTypes.forEach((e) => {
      if (element === e.symbol) {
        tokens.push(e.type);
      }
    });
  });
  return tokens;
}

function parser(args) {
  const firstElement = args[0];
  const lastElement = args[args.length - 1];

  if (firstElement === "LEFT_BRACE" && lastElement === "RIGHT_BRACE") {
    console.log("Valid JSON.");
    process.exit(0);
  } else {
    console.log("Invalid JSON.");
    process.exit(1);
  }
}

console.log(argv);
let data = "";

process.stdin.on("data", (chunk) => {
  data += chunk.toString();
});

process.stdin.on("end", () => {
  console.log(data);
  const tokens = lexer(data);
  parser(tokens);
});
