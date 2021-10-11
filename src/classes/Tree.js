class Tree {
  constructor(question, entropy, gain = 0, gainRatio=0, branches, isLeaf = false) {
    this.question = question
    this.gainRatio = gainRatio
    this.entropy = entropy
    this.gain = gain
    this.branches = branches
    this.isLeaf = isLeaf
    this.descendants = []
  }
}

