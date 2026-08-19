#!/usr/bin/env node
"use strict";

import { type } from "node:os";
import { argv } from "node:process";
import process from "node:process";

const valueTypes = ["STRING", "NUMBER", "BOOLEAN", "NULL"];

const expectedObject = ["STRING", "COLON", "VALUE"];

function lexer(input) {
  const tokens = [];
  let isInsideString = false;
  let stringCollection = "";
  let numberCollection = "";
  let dataValue = "";

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
          type: "STRING",
          value: `${stringCollection}`,
        };
        tokens.push(obj);
        stringCollection = "";
      }
    }

    if (/^\d+$/.test(element) && !isInsideString) {
      numberCollection += element;
    }

    if (
      /^\d+$/.test(element) &&
      !/^\d+$/.test(input[index + 1]) &&
      !isInsideString
    ) {
      const obj = {
        type: "NUMBER",
        value: `${numberCollection}`,
      };
      tokens.push(obj);
      numberCollection = "";
    }

    if (isInsideString && element != '"') {
      stringCollection += element;
    }

    if (
      element.match(/[a-z]/i) &&
      element != '"' &&
      !isInsideString &&
      !/^\d+$/.test(element)
    ) {
      dataValue += element;
    }
    console.log(dataValue);

    if (dataValue && !/[a-z]/i.test(input[index + 1])) {
      switch (dataValue) {
        case "true":
          const trueObj = {
            type: "BOOLEAN",
            value: true,
          };
          tokens.push(trueObj);
          dataValue = "";
          break;
        case "false":
          let falseObj = {
            type: "BOOLEAN",
            value: false,
          };
          tokens.push(falseObj);
          dataValue = "";
          break;
        case "null":
          let nullObj = {
            type: "NULL",
            value: null,
          };
          tokens.push(nullObj);
          dataValue = "";
          break;
        default:
          tokens.push("INVALID");
          dataValue = "";
      }
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
        valueTypes.includes(args[index - 1].type) &&
        args[index + 1].type === "STRING"
      ) {
        counter = 0;
        continue;
      }

      if (counter === 0 || counter === 1) {
        if (expectedObject[counter] !== element.type) {
          console.log("Invalid JSON.");
          process.exit(1);
        }
      } else if (counter === 2) {
        if (!valueTypes.includes(element.type)) {
          console.log("Invalid JSON.");
          process.exit(1);
        }
      } else if (counter > 2) {
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
