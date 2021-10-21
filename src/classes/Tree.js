export default class Tree {
  constructor(id = null ,node = '',leafConfidence = '', classValue = '', entropy = null, gain = null, gainRatio = null, branches = [], isLeaf = false, descendants=[]) {
    this.id = id
    this.node = node
    this.leafConfidence = leafConfidence
    this.classValue = classValue
    this.gainRatio = gainRatio
    this.entropy = entropy
    this.gain = gain
    this.branches = branches
    this.isLeaf = isLeaf
    this.descendants = descendants
  }
}

