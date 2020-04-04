/*
import {ElementRef} from '@angular/core';
import * as d3 from 'd3';

export class BaseD3GraphComponent {

  svg;
  protected width = '1745px';
  protected height = '1100px';
  protected host;


  protected padding = 40;
  protected drag: any = d3.drag();

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);
  }
  protected buildSVG() {
    this.host.html('');
    this.svg = this.host.append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('padding-top', this.padding - 10)
      .style('padding-left', this.padding)
      .style('padding-bottom', this.padding)
      .style('background-color', 'lightgray');
  }
}

*/
