class Node {
    constructor(attribute,branches){
        this.attribute = attribute;
        this.branches = branches;
    }
}

class RootNode extends Node {
    constructor(){
        super()
    };
};