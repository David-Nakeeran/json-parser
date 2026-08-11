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
    if (/\s/.test(element)) {
      return;
    }

    const token = tokenTypes.find((e) => {
      return element === e.symbol;
    });

    if (token) {
      tokens.push(token.type);
    } else {
      tokens.push("INVALID");
    }
  });

  return tokens;
}

function parser(args) {
  if (
    args.length === 2 &&
    args[0] === "LEFT_BRACE" &&
    args[1] === "RIGHT_BRACE"
  ) {
    console.log("Valid JSON.");
    process.exit(0);
  } else {
    console.log("Invalid JSON.");
    process.exit(1);
  }
}

let data = "";

process.stdin.on("data", (chunk) => {
  data += chunk.toString();
});

process.stdin.on("end", () => {
  console.log(data);
  const tokens = lexer(data);
  parser(tokens);
});
