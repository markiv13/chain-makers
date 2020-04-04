import {TestBed} from '@angular/core/testing';
import {PropertyGraphDataService} from './property-graph-data.service';
import {DirectedGraph} from '../../models/directedgraph';
import {Vertex} from '../../models/Vertex';
import {Edge} from '../../models/edge';
import {Condition} from '../../models/condition';
import {VertexOutlook} from '../../models/VertexOutlook';


describe('PropertyGraphDataService', () => {
  let service;
  let VERTEXES: Vertex[];
  let EDGES: Edge[];
  let DIRECTEDGRAPH: DirectedGraph;
  let VERTEXOUTLOOK: VertexOutlook;

  beforeEach(() => {
    VERTEXES = [
      new Vertex(1, '1', 1, 1, [new Condition(1, 'TRAIT', 'EQUALS', ['TEST Vertex'])],
        new VertexOutlook(1, 1), 'Capability'),

      new Vertex(2, '2', 2, 2, [],
        new VertexOutlook(2, 2), 'Capability')
    ];
    EDGES = [
      new Edge(1, 1, 2, [new Condition(1, 'TRAIT', 'EQUALS', ['TEST Edge'])])
    ];
    DIRECTEDGRAPH = new DirectedGraph('masks-1', VERTEXES, EDGES);
    VERTEXOUTLOOK = {xCoordinate: 1, yCoordinate: 2};

    TestBed.configureTestingModule({
      providers: [PropertyGraphDataService]
    });

    service = TestBed.get(PropertyGraphDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#setGraphData', () => {
    beforeEach(() => {
      spyOn(service.graphData$, 'next');

      service.setGraphData(DIRECTEDGRAPH);
    });

    it('should call graphData$.next with correct param', () => {
      expect(service.graphData$.next).toHaveBeenCalledWith(DIRECTEDGRAPH);
    });
  });

  describe('#getGraphData', () => {
    beforeEach(() => {
      spyOn(service.graphData$, 'getValue').and.returnValue(DIRECTEDGRAPH);
    });

    it('should call graphData$.getValue', () => {
      service.getGraphData();
      expect(service.graphData$.getValue).toHaveBeenCalled();
    });

    it('should #getGraphData return correct data', () => {
      expect(service.getGraphData()).toEqual(DIRECTEDGRAPH);
    });
  });

  describe('#setVertexPosition', () => {
    beforeEach(() => {
      spyOn(service.vertexPosition$, 'next');

      service.setVertexPosition(VERTEXOUTLOOK);
    });

    it('should call vertexPosition$.next with correct param', () => {
      expect(service.vertexPosition$.next).toHaveBeenCalledWith(VERTEXOUTLOOK);
    });
  });

  describe('#getVertexPosition', () => {
    it('should #getVertexPosition return correct data', () => {
      expect(service.getVertexPosition()).toEqual(service.vertexPosition$);
    });
  });

  describe('getVertexDataInGraph', () => {
    it('should return vertex for the given id', () => {
      service.graphData$.next(DIRECTEDGRAPH);
      expect(service.getVertexDataInGraph(1)).toEqual(VERTEXES[0]);
    });

    it('should temporary return something when graphData$.getValue() === null until reload fixed', () => {
      const tempV = new Vertex(0, '', 0, 0, [], new VertexOutlook(0, 0), 'reload');
      expect(service.getVertexDataInGraph(1)).toEqual(tempV);
    });
  });

  describe('getEdgeDataInGraph', () => {
    it('should return vertex for the given id', () => {
      service.graphData$.next(DIRECTEDGRAPH);
      expect(service.getEdgeDataInGraph(1)).toEqual(EDGES[0]);
    });

    it('should temporary return something when graphData$.getValue() === null until reload fixed', () => {
      const tempE = new Edge(0, 0, 0, []);
      expect(service.getEdgeDataInGraph(1)).toEqual(tempE);
    });
  });

  describe('getVertexTitle', () => {
    it('should return the title of vertex for the given id', () => {
      service.graphData$.next(DIRECTEDGRAPH);
      expect(service.getVertexTitle(1)).toEqual(VERTEXES[0].title);
    });

    it('should temporary return something when graphData$.getValue() === null until reload fixed', () => {
      expect(service.getVertexTitle(1)).toEqual('');
    });
  });

  describe('getConditions', () => {
    it('should return the conditions of edge for the given id', () => {
      service.graphData$.next(DIRECTEDGRAPH);
      expect(service.getConditions(1, 'edge')).toEqual(EDGES[0].conditions);
    });

    it('should return the conditions of vertex for the given id', () => {
      service.graphData$.next(DIRECTEDGRAPH);
      expect(service.getConditions(1, 'vertex')).toEqual(VERTEXES[0].conditions);
    });

    it('should temporary return something when graphData$.getValue() === null until reload fixed', () => {
      expect(service.getConditions(1, 'vertex')).toEqual([]);
    });
  });
});
