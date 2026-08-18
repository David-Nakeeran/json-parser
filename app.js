#!/usr/bin/env node
"use strict";

import { argv } from "node:process";
import process from "node:process";

const tokenTypes = [
  { type: "LEFT_BRACE", symbol: "{" },
  { type: "COLON", symbol: ":" },
  { type: "RIGHT_BRACE", symbol: "}" },
];

const expectedObject = ["KEY", "COLON", "VALUE"];

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

    if (element === ",") {
      const commaObject = { type: "COMMA", value: "," };
      tokens.push(commaObject);
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
  if (
    args[0].type === "LEFT_BRACE" &&
    args[args.length - 1].type === "RIGHT_BRACE"
  ) {
    if (args.length === 2) {
      console.log("Valid JSON.");
      process.exit(0);
    }

    if (args.includes("INVALID")) {
      console.log("Invalid JSON.");
      process.exit(1);
    }

    let counter = 0;
    for (let index = 1; index < args.length - 1; index++) {
      const element = args[index];
      if (
        element.type === "COMMA" &&
        args[index - 1].type === "VALUE" &&
        args[index + 1].type === "KEY"
      ) {
        counter = 0;
        continue;
      }

      if (expectedObject[counter] !== element.type) {
        console.log("Invalid JSON.");
        process.exit(1);
      }

      counter++;
    }

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
  // console.log(data);
  const tokens = lexer(data);
  parser(tokens);
});
