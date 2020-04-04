import {Vertex} from './Vertex';
import {Edge} from './edge';

export class DirectedGraph {
  graphName: string;
  restVertices: Vertex[];
  restEdges: Edge[];

  constructor(graphName: string, restVertices: Vertex[], restEdges: Edge[]) {
    this.graphName = graphName;
    this.restVertices = restVertices;
    this.restEdges = restEdges;
  }
}
