import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NetworkGraphComponent} from './network-graph.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SupplyNetworkService} from '../../services/supply-network/supply-network.service';
import {PropertyGraphDataService} from '../../../shared/services/property-graph/property-graph-data.service';
import {of} from 'rxjs';
import {DIRECTED_GRAPHS, GRAPH_IDS} from '../../../shared/testing-helpers/supply-network-testing-data';

describe('NetworkGraphComponent', () => {
  let component: NetworkGraphComponent;
  let fixture: ComponentFixture<NetworkGraphComponent>;
  let propertyGraphDataServiceSpy;
  let supplyNetworkServiceSpy;

  beforeEach(async(() => {
    supplyNetworkServiceSpy = jasmine.createSpyObj(['getSupplyNetworkGraph', 'updateGraphLayout', 'getAvailableGraphsIds']);
    propertyGraphDataServiceSpy = jasmine.createSpyObj(['setGraphData', 'getGraphData']);

    supplyNetworkServiceSpy.getSupplyNetworkGraph.and.returnValue(of(DIRECTED_GRAPHS[0]));
    supplyNetworkServiceSpy.getAvailableGraphsIds.and.returnValue(of(GRAPH_IDS));

    TestBed.configureTestingModule({
      declarations: [
        NetworkGraphComponent
      ],
      providers: [
        {provide: SupplyNetworkService, useValue: supplyNetworkServiceSpy},
        {provide: PropertyGraphDataService, useValue: propertyGraphDataServiceSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]

    });
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NetworkGraphComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'loadSupplyNetworkData');
      spyOn(component, 'fetchAvailableGraphIds');
      fixture.detectChanges();
    });

    it('should call #loadSupplyNetworkData', () => {
      expect(component.loadSupplyNetworkData).toHaveBeenCalled();
    });

    it('should call #fetchAvailableGraphIds', () => {
      expect(component.fetchAvailableGraphIds).toHaveBeenCalled();
    });
  });

  describe('#loadSupplyNetworkData', () => {
    it('should call #supplyNetworkService.getSupplyNetworkGraph', () => {
      component.loadSupplyNetworkData();

      expect(supplyNetworkServiceSpy.getSupplyNetworkGraph).toHaveBeenCalled();
    });

    it('should call #graphDataService.setGraphData with correct param', () => {
      component.loadSupplyNetworkData();

      expect(propertyGraphDataServiceSpy.setGraphData).toHaveBeenCalledWith(DIRECTED_GRAPHS[0]);
    });
  });

  describe('#saveSupplyNetworkData', () => {
    beforeEach(() => {
      component.saveSupplyNetworkData();
    });

    it('should call #supplyNetworkService.getGraphData with correct param', () => {
      expect(supplyNetworkServiceSpy.updateGraphLayout).toHaveBeenCalledWith(propertyGraphDataServiceSpy.getGraphData());
    });

    it('should call #propertyGraphDataService.getGraphData', () => {
      expect(propertyGraphDataServiceSpy.getGraphData).toHaveBeenCalled();
    });
  });

  describe('#fetchAvailableGraphIds', () => {
    beforeEach(() => {
      component.fetchAvailableGraphIds();
    });

    it('should call #supplyNetworkService.getAvailableGraphsIds', () => {
      expect(supplyNetworkServiceSpy.getAvailableGraphsIds).toHaveBeenCalled();
    });

    it('should sett .graphs to correct value', () => {
      expect(component.graphs).toEqual(GRAPH_IDS);
    });

    it('should sett .selectedGraph to correct value', () => {
      expect(component.selectedGraph).toEqual(GRAPH_IDS[0]);
    });
  });

  describe('#onActivateOperation', () => {
    it('should set .isCollapsed to false', () => {
      component.onActivateOperation();

      expect(component.isCollapsed).toBe(false);
    });
  });

  describe('#onDeactivateOperation', () => {
    it('should set .isCollapsed to true', () => {
      component.onDeactivateOperation();

      expect(component.isCollapsed).toBe(true);
    });
  });
});
