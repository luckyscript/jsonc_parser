/**
 *
 * @param {String} content
 */
export default {
  parse(content) {
    if (typeof content != "string") content = JSON.stringify(content);
    if (!content) return;
    let result = [];
    let contentArray = content.split("");
    if (contentArray[0] == "{") {
      // object like json
      result = objectJsonParser(content.split(""));
    } else if (contentArray.shift() == "[") {
      // array like json
      let arrayLike = JSON.parse(content);
      if (arrayLike.length == 0) return result;
      arrayLike.forEach((v, i) => {
        result.push(objectJsonParser(JSON.stringify(v)));
      });
    } else {
      console.error("not a valid json");
      throw new Error("not a valid json");
    }
    return result;
  }
};

/**
 *
 * @param {Array} contentArray
 */
function objectJsonParser(contentArray) {
  // console.log('contentArray', contentArray)
  if (contentArray.indexOf(":") == -1) {
    if (contentArray.join("") == "{}") return [];
    return contentArray.join("");
  } else if (contentArray[0] == "[") {
    // array type do not need to convert
    return contentArray.join("");
  }
  let char = "";
  let stack = [];
  let commentStack = [];
  let result = [];
  let object = new Object();
  let counter = 0; // judge hierarchy
  let prevChar = ""; // save last char, sometimes like '//' need this sign
  let stackLock = false; // lock stack
  let valueEnd = true;
  let isPushedValue = false;
  let isSemiPush = false;
  let isArrayValue = false;
  let isStringValue = false;
  let multi = false;
  let arrCounter = 0; //arr count
  for (char of contentArray) {
    // if {, push
    if (char == "{" && !isStringValue) {
      //// console.log("caaa",char);
      if (counter > 0) {
        stack.push(char);
      }
      counter += 1;
    } else if (char == "}" && !isStringValue) {
      if (counter > 1) {
        stack.push(char);
      }
      counter -= 1;
    } else {
      if (char == ":" && counter == 1 && !isArrayValue && !isStringValue) {
        //// console.log("caaa",char);
        object.key = stack.join("").trim();
        valueEnd = false;
        isSemiPush = false;
        isPushedValue = false;
        stack = [];
      } else if (
        char == "," &&
        counter == 1 &&
        !isArrayValue &&
        !isStringValue
      ) {
        object.children =
          typeof objectJsonParser(
            stack
              .join("")
              .trim()
              .split("")
          ) == "string"
            ? []
            : objectJsonParser(
                stack
                  .join("")
                  .trim()
                  .split("")
              );

        object.value = delEmpty(stack)
          .join("")
          .trim();
        object.type = judgeType(delEmpty(stack));
        valueEnd = true;
        // result.push({...object});
        result.push(JSON.parse(JSON.stringify(object)));
        stack = [];
        isSemiPush = true;
      } else if (
        char == "*" &&
        prevChar == "/" &&
        counter == 1 &&
        !isArrayValue &&
        !isStringValue
      ) {
        multi = true;
        stack.pop();
        if (!valueEnd) {
          object.children =
            typeof objectJsonParser(
              stack
                .join("")
                .trim()
                .split("")
            ) == "string"
              ? []
              : objectJsonParser(
                  stack
                    .join("")
                    .trim()
                    .split("")
                );
          object.value = delEmpty(stack)
            .join("")
            .trim();
          object.type = judgeType(delEmpty(stack));
          valueEnd = true;
        }
        stackLock = true;
      } else if (
        char == "/" &&
        prevChar == "*" &&
        counter == 1 &&
        !isArrayValue &&
        !isStringValue
      ) {
        if (stackLock && multi) {
          stackLock = false;
          multi = false;
          commentStack.pop();
          if (commentStack.length != 0) {
            object.description = commentStack.join("").trim();
            if (isSemiPush) {
              result.pop();
            }
            // result.push({...object});
            result.push(JSON.parse(JSON.stringify(object)));
            isPushedValue = true;
            object = new Object();
            commentStack = [];
          }
        }
        if (!valueEnd) {
          stack.push(char);
        }
      } else if (
        char == "/" &&
        prevChar == "/" &&
        counter == 1 &&
        !isArrayValue &&
        !isStringValue
      ) {
        stack.pop();
        if (!valueEnd) {
          object.children =
            typeof objectJsonParser(
              stack
                .join("")
                .trim()
                .split("")
            ) == "string"
              ? []
              : objectJsonParser(
                  stack
                    .join("")
                    .trim()
                    .split("")
                );
          object.value = delEmpty(stack)
            .join("")
            .trim();
          object.type = judgeType(delEmpty(stack));
          valueEnd = true;
        }
        stackLock = true;
      } else if (
        (char == "\n" || char == '"') &&
        counter == 1 &&
        !isArrayValue
      ) {
        if (stackLock && !multi) {
          stackLock = false;
          if (commentStack.length != 0) {
            object.description = commentStack.join("").trim();
            if (isSemiPush) {
              result.pop();
            }
            // result.push({...object});
            result.push(JSON.parse(JSON.stringify(object)));
            isPushedValue = true;
            object = new Object();
            commentStack = [];
          }
        }
        if (!valueEnd) {
          stack.push(char);
        }
        if (char == '"') {
          isStringValue = !isStringValue;
        }
      } else if (char == "[") {
        arrCounter += 1;
        stack.push(char);
        isArrayValue = true;
      } else if (char == "]") {
        arrCounter -= 1;
        stack.push(char);
        if (arrCounter == 0) {
          isArrayValue = false;
        }
      } else {
        if (!stackLock) {
          stack.push(char);
          //// console.log('char', char);
        } else {
          commentStack.push(char);
          //// console.log('c',char)
        }
      }
    }
    prevChar = char;
  }

  if (!valueEnd) {
    let v = objectJsonParser(
      stack
        .join("")
        .trim()
        .split("")
    );
    //// console.log('v', v)
    object.children = typeof v == "string" ? [] : v;

    object.value = delEmpty(stack)
      .join("")
      .trim();
    object.type = judgeType(delEmpty(stack));
    if (object.type !== "object") {
      delete object.children;
    }
    valueEnd = true;
  }
  // result.push({...object});
  if (!isPushedValue) {
    result.push(JSON.parse(JSON.stringify(object)));
  }
  if (counter == 0) {
    return result;
  } else {
    console.error("no valid json in objectJsonParser");
    // throw new Error("no valid json in objectJsonParser");
    return contentArray.join("");
  }
}

let delElement = (arr, i) => {
  return arr.this.filter(t => t != i);
};
let delEmpty = arr => {
  return arr.filter(t => t != "\n" && t != " ");
};
// Array.prototype.delEmpty = function() {
//   return this.filter(t => t != "\n" && t != " ");
// };

// Array.prototype.delElement = function(i) {
//   return this.filter(t => t != i);
// };

function judgeType(stack) {
  let result;
  if (stack[0] == '"') {
    result = "string";
  } else if (stack[0] == "{") {
    result = "object";
  } else if (stack[0] == "[") {
    result = "array";
  } else {
    if (stack.join("") == "false" || stack.join("") == "true") {
      result = "boolean";
    } else if (stack.join("") == "null") {
      result = "null";
    } else {
      result = "number";
    }
  }
  return result;
}
