export default class Tree {
  constructor(node = '',leafConfidence = '', className = '', entropy = null, gain = null, gainRatio = null, branches = [], isLeaf = false, descendants=[]) {
    this.node = node
    this.leafConfidence = leafConfidence
    this.className = className
    this.gainRatio = gainRatio
    this.entropy = entropy
    this.gain = gain
    this.branches = branches
    this.isLeaf = isLeaf
    this.descendants = descendants
  }
}

