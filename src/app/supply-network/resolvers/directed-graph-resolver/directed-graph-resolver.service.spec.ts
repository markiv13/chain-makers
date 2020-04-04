import {DirectedGraphResolverService} from './directed-graph-resolver.service';
import {of} from 'rxjs';

describe('DirectedGraphResolverService', () => {
  let service: DirectedGraphResolverService;
  let supplyNetworkServiceSpy;

  beforeEach(() => {
    supplyNetworkServiceSpy = jasmine.createSpyObj(['getSupplyNetworkGraph']);
    service = new DirectedGraphResolverService(supplyNetworkServiceSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#resolve', () => {
    it('should call #supplyNetworkServiceSpy.getSupplyNetworkGraph once', () => {
      supplyNetworkServiceSpy.getSupplyNetworkGraph.and.returnValue(of());
      service.resolve(null, null);

      expect(supplyNetworkServiceSpy.getSupplyNetworkGraph).toHaveBeenCalledTimes(1);
    });
  });
});
