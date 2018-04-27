export default function (object, type, n) {
    let strArr = [];
    let tab = '    ';
    // let tab = '    '
    if (type = 'object') {
        strArr.push('{\n');
        objectDeparser(strArr, object, n);
        strArr.push('\n'+repeat(tab, n)+'}')
    }
    // console.log(strArr.join(""))
    return strArr.join("")
}

function objectDeparser(strArr, object, n) {
    let len = object.length;
    let tab = '    ';
    for(let i = 0; i != len; i++) {
        strArr.push(repeat(tab, n+1) + '"' + object[i]['key'] + '"' + ':');
        if (object[i]['type'] == 'object') {
                strArr.push(deparser(object[i]['children'], 'object', n+1));
        } else if (object[i]['type'] == 'string') {
            strArr.push(object[i]['value']);
        } else if (object[i]['type'] == 'number') {
            strArr.push(object[i]['value']);
        } else {
            strArr.push(object[i]['value']);
        }
        // if(typeof(object[i]['children']) == 'string') {
        //     strArr.push(object[i]['children']);
        // } else {
        //     strArr.push(deparser(object[i]['children'], 'object', n+1));
        // }
        if (i<len-1) {
            strArr.push(',');
        }
        if(object[i]['description']) {
            strArr.push(' //' + object[i]['description']);
        }
        if (i<len-1) {
            strArr.push('\n');
        }
    }
    return strArr;
}

function repeat(str, n) {
    let result = '';
    for (var i = 0; i != n; i++) {
        result += str;
    }
    return result;
}
