import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DirectedGraph} from '../../../shared/models/directedgraph';
import {EMPTY, Observable, of} from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';
import {SupplyNetworkService} from '../../services/supply-network/supply-network.service';

@Injectable({
  providedIn: 'root'
})
export class DirectedGraphResolverService implements Resolve<DirectedGraph> {

  constructor(private supplyNetworkService: SupplyNetworkService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DirectedGraph> | Observable<never> {
    return this.supplyNetworkService.getSupplyNetworkGraph().pipe(catchError(error => {
        return EMPTY;
      }), mergeMap(supplyNetworkGraph => {
        if (supplyNetworkGraph) {
          return of(supplyNetworkGraph);
        } else {
          return EMPTY;
        }
      })
    );
  }
}
