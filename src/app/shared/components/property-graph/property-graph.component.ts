import {Component, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs';
import * as d3 from 'd3';
import {DirectedGraph} from '../../models/directedgraph';
import {Edge} from '../../models/edge';
import {Vertex} from '../../models/Vertex';
import {ActivatedRoute, Router} from '@angular/router';
import {PropertyGraphDataService} from '../../services/property-graph/property-graph-data.service';
import {StateService} from '../../services/state/state.service';
import {VertexOutlook} from '../../models/VertexOutlook';

const vertexDivIdPrefix = 'v_';
const vertexTitleDivIdPrefix = 'vt_';
const edgeDivIdPrefix = 'e_';
const edgeTitleDivIdPrefix = 'et_';
const vertexCircleRadius = 25;

function generateSvgPathCommand(srcX, srcY, targetX, targetY) {
  if (srcX < targetX) {
    return `M${Math.round(srcX) + vertexCircleRadius},${srcY}L${Math.round(targetX) - vertexCircleRadius},${targetY}`;
  }

  return `M${Math.round(srcX) - vertexCircleRadius},${srcY}L${Math.round(targetX) + vertexCircleRadius},${targetY}`;
}

function generateEdgeTitleTransformAttr(srcX: any, targetX: any, srcY: any, targetY: any) {

  const sx = Math.round(srcX);
  const sy = Math.round(srcY);
  const tx = Math.round(targetX);
  const ty = Math.round(targetY);

  const x = (sx > tx) ? (tx + ((sx - tx) / 2)) : (sx + ((tx - sx) / 2));
  const y = (sy > ty) ? (ty + ((sy - ty) / 2)) : (sy + ((ty - sy) / 2));

  return `translate(${x},${y - 5})`;
}

function generateTransformAttributeEdgeLabel(e: Edge) {
  return generateEdgeTitleTransformAttr(
    d3.select('#' + vertexDivIdPrefix + e.source).attr('x'),
    d3.select('#' + vertexDivIdPrefix + e.target).attr('x'),
    d3.select('#' + vertexDivIdPrefix + e.source).attr('y'),
    d3.select('#' + vertexDivIdPrefix + e.target).attr('y'));
}

function getVertexLabelTransformAttr(d: Vertex) {
  return `translate(${d.fx},${d.fy + vertexCircleRadius + 15})`;
}

@Component({
  selector: 'app-property-graph',
  templateUrl: './property-graph.component.html',
  styleUrls: ['./property-graph.component.less']
})
export class PropertyGraphComponent implements OnInit, OnDestroy, OnChanges {
  svg: any;
  graphData: DirectedGraph = new DirectedGraph('', [], []);
  courserStyle: string;

  private graphDataSubscription: Subscription;

  @Output() private graphItemClickEmitter = new EventEmitter<object>();

  constructor(private propertyGraphDataService: PropertyGraphDataService,
              private router: Router,
              private route: ActivatedRoute,
              element: ElementRef,
              private stateService: StateService) {
  }

  ngOnInit() {
    this.stateService.setCurrentState();
    this.svg = d3.select('#supplyNetworkSvg');
    this.subscribeToGraphDataChanges();
    this.getCurrentUrl();
  }

  subscribeToGraphDataChanges() {
    this.graphDataSubscription = this.propertyGraphDataService.graphData$
      .subscribe((g => {
        if (g != null) {
          this.graphData = g;
        }
        this.render();
      }));
  }

  getCurrentUrl() {
    this.setCourserStyle(this.router.routerState.snapshot.url);
    this.stateService.getCurrentUrl().subscribe((data) => {
      this.setCourserStyle(data);
    });
  }

  setCourserStyle(name: string) {
    if (name === '/supply-network/network-masks/create-vertex') {
      this.courserStyle = 'crosshair';

    } else if (name === 'create-edge' || name === '/supply-network/network-masks/create-edge') {
      this.courserStyle = 'nw-resize';

    } else if (name === 'edit') {
      this.courserStyle = 'alias';

    } else {
      this.courserStyle = 'grab';
    }
  }

  render() {

    d3.selectAll('svg > *').remove();
    this.mouseRightClickListener();

    this.defineGraphicalObjects();

    this.generateVertices();

    this.generateVerticesLabel();

    this.generateEdges();

    this.generateEdgesLabel();
  }

  mouseRightClickListener() {
    this.svg.on('contextmenu', (c) => {
      d3.event.preventDefault();
      if (d3.event.button === 2) {
        this.propertyGraphDataService.setVertexPosition(new VertexOutlook(d3.event.offsetX, d3.event.offsetY));
      }
    });
  }

  vertexDragBehaviourFunction(outputter) {

    function dragStarted(d) {
      d3.select(this).raise().attr('stroke', 'black');
      outputter.emit(this);
    }

    function dragIncomingEdges(d: Vertex) {

      const incomingEdges = d3.selectAll('path').filter((e: Edge) => {
        return e != null ? e.target === d.id : false;
      });

      incomingEdges.attr('d', (p: Edge) => {
        return generateSvgPathCommand(
          d3.select('#' + vertexDivIdPrefix + p.source).attr('x'),
          d3.select('#' + vertexDivIdPrefix + p.source).attr('y'),
          d.fx,
          d.fy);
      });

      incomingEdges.data().forEach((e: Edge) => d3.select('#et_' + e.source + '_' + e.target)
        .attr('transform', generateTransformAttributeEdgeLabel(e)));
    }

    function dragOutgoingEdges(vertex: Vertex) {
      const outgoingEdges = d3.selectAll('path').filter((e: Edge) => {
        return e != null ? e.source === vertex.id : false;
      });
      outgoingEdges.attr('d', (p: Edge) => {

        return generateSvgPathCommand(
          vertex.fx,
          vertex.fy,
          d3.select('#' + vertexDivIdPrefix + p.target).attr('x'),
          d3.select('#' + vertexDivIdPrefix + p.target).attr('y'));
      });
      // move edge labels for outgoing
      outgoingEdges.data().forEach((e: Edge) => d3.select('#et_' + e.source + '_' + e.target)
        .attr('transform', generateTransformAttributeEdgeLabel(e)));
    }

    function dragged(vertex: Vertex) {
      const eventX = d3.event.x;
      const eventY = d3.event.y;

      d3.select(this).attr('x', eventX);
      d3.select(this).attr('y', eventY);
      vertex.fx = d3.event.x;
      vertex.fy = d3.event.y;

      d3.select(this).attr('transform', `translate(${vertex.fx},${vertex.fy})`);

      d3.select('#vt_' + vertex.id).attr('transform', (d: Vertex) => getVertexLabelTransformAttr(vertex));

      dragOutgoingEdges(vertex);

      dragIncomingEdges(vertex);
    }

    function dragEnded(d) {
      d3.select(this).attr('stroke', null);
    }

    return d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded);
  }

  private generateEdgesLabel() {
    function getEdgeLabel(e: Edge) {
      return '';
    }

    this.svg.append('svg:g').selectAll('g').data(this.graphData.restEdges)
      .enter()
      .append('text')
      .text((e) => getEdgeLabel(e))
      .attr('id', (e) => edgeTitleDivIdPrefix + e.source + '_' + e.target)
      .attr('text-anchor', 'end')
      .attr('transform', (e: Edge) => {
        return generateTransformAttributeEdgeLabel(e);
      });
  }

  private generateVerticesLabel() {
    this.svg.append('svg:g').selectAll('g').data(this.graphData.restVertices).enter()
      .append('text')
      .attr('id', (d) => vertexTitleDivIdPrefix + d.id)
      .text((v) => v.title)
      .attr('text-anchor', 'middle')
      .attr('transform', (d: Vertex) => getVertexLabelTransformAttr(d));
  }

  private generateEdges() {
    this.svg.append('svg:g').selectAll('g').data(this.graphData.restEdges, (d) => d).enter()
      .append('svg:path')
      .attr('id', (d: Edge) => edgeDivIdPrefix + d.source + '_' + d.target)
      .attr('class', 'link')
      .attr('sourceVertexId', (d: Edge) => d.source)
      .attr('targetVertexId', (d: Edge) => d.target)
      .attr('d', (e: Edge) => this.getSvgPathCommand(e))
      .style('marker-end', 'url(#end-arrow)')
      //.on('mousedown', (d) => this.handleEdgeClickEvent(d))
    ;
    //  .on('mousedown', () => this.handleEdgeClickEvent);
  }

  private defineGraphicalObjects() {
    this.svg.append('svg:defs')
      .append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'black');

    this.svg.append('svg:defs')
      .append('svg:pattern')
      .attr('id', 'FactoryIcon')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('x', 130)
      .attr('y', 130)
      .attr('width', 50)
      .attr('height', 50)
      .attr('viewBox', '0 0 110 110')
      .append('svg:image')
      .attr('width', 95)
      .attr('height', 95)
      .attr('xlink:href', 'assets/images/factory.png');

    this.svg.append('svg:defs')
      .append('svg:pattern')
      .attr('id', 'MaskIcon')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('x', 40)
      .attr('y', 40)
      .attr('width', 80)
      .attr('height', 80)
      .attr('viewBox', '0 0 100 100')
      .append('svg:image')
      .attr('width', 80)
      .attr('height', 80)
      .attr('xlink:href', 'assets/images/n95.jpg');

      this.svg.append('svg:defs')
            .append('svg:pattern')
            .attr('id', 'KarolinskaIcon')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('x', 90)
            .attr('y', 90)
            .attr('width', 60)
            .attr('height', 60)
            .attr('viewBox', '0 0 100 100')
            .append('svg:image')
            .attr('width', 80)
            .attr('height', 80)
            .attr('xlink:href', 'assets/images/hospital.png');

  }

  private lookupVertexIcon(v: Vertex) {
    if (v.type === 'ACTOR') {
      return 'yellow';
    } else if (v.type === 'CONSUMER') {
      return 'url(#KarolinskaIcon';
    } else {
      //return 'yellow';
      return 'url(#MaskIcon';
      //return 'url(#'+v.icon+')';
    }
  }

  private generateVertices() {
    this.svg.append('svg:g').selectAll('g').data(this.graphData.restVertices, (d) => d).enter()
      .append('svg:circle')
      .attr('id', (d) => vertexDivIdPrefix + d.id)
      .attr('r', vertexCircleRadius)
      .attr('x', (v: Vertex) => v.fx)
      .attr('y', (v: Vertex) => v.fy)
      .style('fill', (d) => this.lookupVertexIcon(d))
      .attr('transform', (d: Vertex) => `translate(${d.fx},${d.fy})`)
      //.on('mousedown', (d) => this.handleVertexClickEvent(d))
      .call(this.vertexDragBehaviourFunction(this.graphItemClickEmitter));

  }

  private selectElement(divId) {
    return this.svg.select('#' + divId);
  }

  private getSvgPathCommand(e: Edge) {

    console.log('SVG PAth Edge : ', e)

    const sourceVertexElement = this.selectElement(vertexDivIdPrefix + e.source);
    const targetVertexElement = this.selectElement(vertexDivIdPrefix + e.target);

    const srcX = sourceVertexElement.attr('x');
    const srcY = sourceVertexElement.attr('y');
    const targetX = targetVertexElement.attr('x');
    const targetY = targetVertexElement.attr('y');

    return generateSvgPathCommand(Math.round(srcX), Math.round(srcY), Math.round(targetX), Math.round(targetY));
  }/*

  generateSvgPathCommand(srcX, srcY, targetX, targetY) {
    if (srcX < targetX) {
      return `M${srcX + vertexCircleRadius},${srcY}L${targetX - vertexCircleRadius},${targetY}`;
    }

    return `M${srcX - vertexCircleRadius},${srcY}L${targetX + vertexCircleRadius},${targetY}`;
  }*/

  ngOnDestroy(): void {
    this.graphDataSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  handleVertexClickEvent(data) {
    this.router.navigate([this.graphData.graphName + '/vertex/' + data.id] , {relativeTo: this.route});
  }

  handleEdgeClickEvent(data) {
    this.router.navigate([this.graphData.graphName + '/edge/' + data.id] , {relativeTo: this.route});
  }
}
