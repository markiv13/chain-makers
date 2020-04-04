import {EventEmitter, Injectable, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {DirectedGraph} from '../../models/directedgraph';
import {Vertex} from '../../models/Vertex';
import {VertexOutlook} from '../../models/VertexOutlook';
import {Edge} from '../../models/edge';

@Injectable({
  providedIn: 'root'
})
export class PropertyGraphDataService {
  graphData$ = new BehaviorSubject<DirectedGraph>(null);
  vertexPosition$: Subject<VertexOutlook> = new Subject<VertexOutlook>();

  @Output() graphCommand: EventEmitter<string> = new EventEmitter();

  constructor() {
  }

  setGraphData(g: DirectedGraph) {
    this.graphData$.next(g);
  }

  getGraphData(): DirectedGraph {
    return this.graphData$.getValue();
  }

  setVertexPosition(position: VertexOutlook): void {
    this.vertexPosition$.next(position);
  }

  getVertexPosition(): Observable<VertexOutlook> {
    return this.vertexPosition$;
  }

  getVertexDataInGraph(id: number): Vertex {
    // console.log(this.graphData$.getValue());//TODO: undefined when page refreshed!
    if (this.graphData$.getValue() === null) {
      return new Vertex(0, '', 0, 0, new VertexOutlook(0, 0), 'reload', 0, 0);
    }
    return this.graphData$.getValue().restVertices.find(v => v.id === id);
  }

  getEdgeDataInGraph(id: number): Edge {
    if (this.graphData$.getValue() === null) {
      return new Edge(0, 0, 0);
    }
    return this.graphData$.getValue().restEdges.find(e => e.id === id);
  }

  getVertexTitle(id: number): string {
    if (this.graphData$.getValue() === null) {
      return '';
    }
    return this.graphData$.getValue().restVertices.find(e => e.id === id).title;
  }
}

