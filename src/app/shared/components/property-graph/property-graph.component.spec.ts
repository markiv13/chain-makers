import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {PropertyGraphComponent} from './property-graph.component';
import {RouterTestingModule} from '@angular/router/testing';
import {Vertex} from '../../models/Vertex';
import {Edge} from '../../models/edge';
import {DirectedGraph} from '../../models/directedgraph';
import {VertexOutlook} from '../../models/VertexOutlook';
import * as d3 from 'd3';
import {ActivatedRoute, Router} from '@angular/router';

describe('PropertyGraphComponent', () => {
  let component: PropertyGraphComponent;
  let fixture: ComponentFixture<PropertyGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyGraphComponent ],
      imports: [RouterTestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(PropertyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    component.graphData = getTestGraph();
    component.render();
  });

  afterEach(() => {
    d3.selectAll('svg').remove();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   /* describe('svg creation', () => {
    it('svg should be created with correct height and width', () => {
      expect(getSvg().attr('width')).toBe('1745px');
      expect(getSvg().attr('height')).toBe('1100px');
    });
  }); */

   describe('masks rendering', () => {
    it('should render correct number of vertices', () => {
      expect(getVerticesData().length).toBe(3);
    });

    it('should render correct number of edges', () => {
      expect(getEdgesData().length).toBe(2);
    });

    it('should render correct number of labels', () => {
      expect(getLabels().length).toBe(5);
    });

    /* it('each vertex should have label as title', () => {
      getVerticesData().forEach(v => {
        expect(getLabels().filter(l => l.id === v.id && l.title === v.title).length).toBeGreaterThan(0);
      });
    }); */
  });

   describe('masks click and navigation behavior', () => {
     const graphName = 'masks';

    it('vertex click should navigate to clicked vertex', inject([Router, ActivatedRoute], (router: Router, route: ActivatedRoute) => {
      spyOn(router, 'navigate').and.stub();
      const testVertex = getTestGraph().restVertices[0];
      component.handleVertexClickEvent(testVertex);
      expect(router.navigate).toHaveBeenCalledWith([graphName + '/vertex/' + testVertex.id], {relativeTo: route});
    }));

    it('edge click should navigate to clicked edge', inject([Router, ActivatedRoute], (router: Router, route: ActivatedRoute) => {
      spyOn(router, 'navigate').and.stub();
      const testEdge = getTestGraph().restEdges[0];
      component.handleEdgeClickEvent(testEdge);
      expect(router.navigate).toHaveBeenCalledWith([graphName + '/edge/' + testEdge.id], {relativeTo: route});
    }));
  });

  function getSvg() {
    return d3.select('svg');
  }

  function getVerticesData() {
    return d3.selectAll('circle').data();
  }

  function getEdgesData() {
    return d3.selectAll('path').data().filter(d => d != null);
  }

  function getLabels() {
    return d3.selectAll('text').data();
  }

  function getTestGraph() {
    const vertices: Vertex[] = [
      new Vertex(1, 'TestVertex1', 10, 20, [], new VertexOutlook(100, 100), 'CAPABILITY'),
      new Vertex(2, 'TestVertex2', 11, 21, [], new VertexOutlook(200, 200), 'DELIVERY_REGION'),
      new Vertex(3, 'TestVertex3', 12, 22, [], new VertexOutlook(300, 300), 'OTHER')
    ];
    const edges: Edge[] = [
      new Edge(1, 3, 2, []),
      new Edge(2, 1, 2, [])
    ];
    return new DirectedGraph('masks', vertices, edges);
  }
});

