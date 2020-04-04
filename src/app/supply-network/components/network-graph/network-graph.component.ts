import {Component, OnInit} from '@angular/core';
import {SupplyNetworkService} from '../../services/supply-network/supply-network.service';
import {PropertyGraphDataService} from '../../../shared/services/property-graph/property-graph-data.service';

@Component({
  selector: 'app-network-graph',
  templateUrl: './network-graph.component.html',
  styleUrls: ['./network-graph.component.less']
})
export class NetworkGraphComponent implements OnInit {
  isCollapsed = true;
  graphs;
  selectedGraph;

  constructor(public supplyNetworkService: SupplyNetworkService,
              public propertyGraphDataService: PropertyGraphDataService) {
  }

  ngOnInit() {
    this.loadSupplyNetworkData();
  }

  loadSupplyNetworkData() {
    this.supplyNetworkService.getSupplyNetworkGraph().subscribe(d => this.propertyGraphDataService.setGraphData(d));
  }

  saveSupplyNetworkData() {
    this.supplyNetworkService.updateGraphLayout(this.propertyGraphDataService.getGraphData());
  }

  onActivateOperation() {
    this.isCollapsed = false;
  }

  onDeactivateOperation() {
    this.isCollapsed = true;
  }
}
