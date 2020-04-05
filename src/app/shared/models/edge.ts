export class Edge {
  constructor(
    public id: number,
    public source: number,
    public target: number,
    public requiredCapacity: number,
    public availableCapacity: number
  ) {  }
}

