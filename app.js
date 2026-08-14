#!/usr/bin/env node
"use strict";

import { argv } from "node:process";
import process from "node:process";

const tokenTypes = [
  { type: "LEFT_BRACE", symbol: "{" },
  { type: "COLON", symbol: ":" },
  { type: "RIGHT_BRACE", symbol: "}" },
];

const expectedTypes = ["LEFT_BRACE", "KEY", "COLON", "VALUE", "RIGHT_BRACE"];

function lexer(input) {
  const tokens = [];
  let isInsideString = false;
  let stringCollection = "";
  let isTypeKey = true;

  [...input].forEach((element, index) => {
    if (/\s/.test(element)) {
      return;
    }

    if (element === "{") {
      const leftBraceObject = { type: "LEFT_BRACE", value: "{" };
      tokens.push(leftBraceObject);
    } else if (element === "}") {
      const rightBraceObject = { type: "RIGHT_BRACE", value: "}" };
      tokens.push(rightBraceObject);
    }

    if (element === ":") {
      const colonObject = { type: "COLON", value: ":" };
      tokens.push(colonObject);
    }

    if (element === '"') {
      isInsideString = !isInsideString;
      if (!isInsideString && stringCollection != "") {
        const obj = {
          type: `${isTypeKey ? "KEY" : "VALUE"}`,
          value: `${stringCollection}`,
        };
        tokens.push(obj);
        stringCollection = "";
        isTypeKey = !isTypeKey;
      }
    }

    if (isInsideString && element != '"') {
      stringCollection += element;
    }
  });

  if (tokens.length === 0) {
    tokens.push("INVALID");
  }
  console.log(tokens);
  return tokens;
}

function parser(args) {
  args.forEach((element, index) => {
    if (args.includes("INVALID")) {
      console.log("Invalid JSON.");
      process.exit(1);
    }

    if (expectedTypes[index] !== element.type) {
      console.log("Invalid JSON.");
      process.exit(1);
    }
  });
  console.log("Valid JSON.");
  process.exit(0);
}

let data = "";

process.stdin.on("data", (chunk) => {
  data += chunk.toString();
});

process.stdin.on("end", () => {
  // console.log(data);
  const tokens = lexer(data);
  parser(tokens);
});
