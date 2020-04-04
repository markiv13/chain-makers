import {VertexOutlook} from './VertexOutlook';

export class Vertex {
  constructor(
    public id: number,
    public title: string,
    public actorId: number,
    public activityId: number,
    public outlook: VertexOutlook,
    public type: string
  ) {  }
}
