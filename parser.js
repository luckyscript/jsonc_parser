export default function parser (content) {
    let result;
    let contentArray = content.split("");
    if (contentArray[0] == '{') {
        // object
        result = objectJsonParser(content.split(""));

    } else if (contentArray.shift() == '[') {
        // array
    } else {
        console.error("not a valid json");
    }
    console.log(JSON.stringify(result))
    return result;
}

function objectJsonParser (contentArray) {
    if(contentArray.indexOf(':') == -1) {
        return contentArray.toString();
    }
    let char = '';
    let stack = [];
    let commentStack = [];
    let result = [];
    let object = new Object();
    let counter = 0;
    let prevChar = '';
    let stackLock = false;
    let valueEnd = false;
    let isPushedValue = false;
    let isSemiPush = false;
    for (char of contentArray) {
        // if {, push
        if (char == '{') {
            if(counter >0) {
                stack.push(char)
            }
            counter += 1
        } else if (char == '}') {
            if(counter > 1) {
                stack.push(char)
            }
            counter -=1;
        } else {
            if (char == ':' && counter == 1) {
                object.key = stack.join("").trim();
                valueEnd = false;
                isSemiPush = false;
                stack = []
            } else if (char == ',' && counter == 1) {
                object.children = objectJsonParser(stack.join("").trim());
                object.value = stack.delEmpty().join("").trim();
                valueEnd = true;
                // result.push({...object});
                result.push(JSON.parse(JSON.stringify(object)));
                stack = []
                isSemiPush = true;
            } else if (char == '/' && prevChar == '/' && counter == 1) {
                stack.pop();
                if (!valueEnd) {
                    object.children = objectJsonParser(stack.join("").trim());
                    object.value = stack.delEmpty().join("").trim();
                    valueEnd = true;
                }
                stackLock = true;
            } else if ((char == '\n' || char == '"') && counter == 1) {
                if(stackLock) {
                    stackLock = false;
                    if (commentStack.length != 0) {
                        object.description = commentStack.join("").trim()
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
            } 
            else {
                if (!stackLock) {
                    stack.push(char)
                } else {
                    commentStack.push(char)
                }
            }
        }
        prevChar = char;
    } 
    
    if (!valueEnd) {
        object.children = objectJsonParser(stack.join("").trim());
        object.value = stack.delEmpty().join("").trim();
        valueEnd = true;
    } 
    // result.push({...object});
    if (!isPushedValue) {
        result.push(JSON.parse(JSON.stringify(object)));
    }
    if (counter == 0)  {
        return result;
    } else {
        console.error("no valid json in objectJsonParser")
    }
    
}

Array.prototype.delEmpty = function () {
    return this.filter( t => t!='\n' && t != ' ');
}