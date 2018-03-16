/**
 * 
 * @param {String} content 
 */
exports.parser =  function (content) {
  if(!content) 
    return;
  let result = [];
  let contentArray = content.split("");
  if (contentArray[0] == '{') {
      // object like json
      result = objectJsonParser(content.split(""));

  } else if (contentArray.shift() == '[') {
      // array like json
      let arrayLike = JSON.parse(content);
      if (arrayLike.length == 0)
        return result;
      arrayLike.forEach( (v, i) => {
        result.push(objectJsonParser(JSON.stringify(v)));
      })
  } else {
      console.error("not a valid json");
  }
  return result;
}

/**
* 
* @param {Array} contentArray 
*/
function objectJsonParser(contentArray) {
  if (contentArray.indexOf(":") == -1) {
      if(contentArray.join("") == '{}') 
          return []
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
  let valueStart = false;
  for (char of contentArray) {
    // if {, push
    if (char == "{") {
      if (counter > 0) {
        stack.push(char);
      }
      counter += 1;
    } else if (char == "}") {
      if (counter > 1) {
        stack.push(char);
      }
      counter -= 1;
    } else {
      if (char == ":" && counter == 1) {
        object.key = stack.join("").trim();
        valueEnd = false;
        isSemiPush = false;
        isPushedValue = false;
        stack = [];
      } else if (char == "," && counter == 1 && !isArrayValue) {
        object.children = (typeof objectJsonParser(stack.join("").trim().split(""))) == 'string'? []: objectJsonParser(stack.join("").trim().split(""));
        object.value = delEmpty(stack)
          .join("")
          .trim();
        object.type = judgeType(delEmpty(stack));
        valueEnd = true;
        // result.push({...object});
        result.push(JSON.parse(JSON.stringify(object)));
        stack = [];
        isSemiPush = true;
      } else if (char == "/" && prevChar == "/" && counter == 1 && !valueStart) {
        stack.pop();
        if (!valueEnd) {
          object.children = (typeof objectJsonParser(stack.join("").trim().split(""))) == 'string'? []: objectJsonParser(stack.join("").trim().split(""));
          object.value = delEmpty(stack)
            .join("")
            .trim();
          object.type = judgeType(delEmpty(stack));
          valueEnd = true;
        }
        stackLock = true;
      } else if ((char == "\n" || char == '"') && counter == 1) {
        
        if(char == '"') {
          valueStart = !valueStart;
        }
        if (stackLock) {
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
      } else if (char == "[" || char == "]") {
        stack.push(char);
        isArrayValue = !isArrayValue;
      } else {
        if (!stackLock) {
          stack.push(char);
        } else {
          commentStack.push(char);
        }
      }
    }
    prevChar = char;
  }

  if (!valueEnd) {
    object.children = (typeof objectJsonParser(stack.join("").trim().split(""))) == 'string'? []: objectJsonParser(stack.join("").trim().split(""));
    object.value = delEmpty(stack)
      .join("")
      .trim();
    object.type = judgeType(delEmpty(stack));
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
  }
}

let delElement = (arr, i) => {
  return arr.this.filter(t => t != i);
}
let delEmpty = (arr) => {
    return arr.filter(t => t != "\n" && t != " ");
}
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
      result = "bool";
    } else {
      result = "number";
    }
  }
  return result;
}

