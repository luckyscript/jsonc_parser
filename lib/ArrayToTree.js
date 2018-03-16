
let data = []
export default function ArrayToTree(data) {
    let tree = [];
    for (let i = 0; i != data.length; i++) {
        if(!data[i]['_parent'] && !data[i]['_isDeleted']) {
            let v = data[i];
            removeParent(v);
            tree.push(v)
        }
    }
    return tree
}

function removeParent(v) {
    console.log('v',v)
    if(v._parent){
        console.log('vd',v)
        delete v._parent
    }
    if (v.children && v.children.length > 0) {
        v.children.forEach(va => {
            removeParent(va)
        })
    } else {
        return;
    }

}