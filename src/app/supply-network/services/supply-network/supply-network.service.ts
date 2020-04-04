import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DirectedGraph} from '../../../shared/models/directedgraph';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplyNetworkService {

  baseUrl = environment.apiUrl + '/ssn';
  url={
    masks:`${this.baseUrl}/graphs/masks`,
    graphs:`${this.baseUrl}/graphs`,
    vertices:`${this.baseUrl}/vertices`,
    edges:`${this.baseUrl}/edges`,
    simulation:`${this.baseUrl}/simulation`,
  };

  vertex = `${this.url.graphs}/vertex/`;
  edge = `${this.url.graphs}/edge/`;

  httpOptions = {withCredentials: true};

  constructor(private http: HttpClient) {
  }

  getSupplyNetworkGraph(): Observable<DirectedGraph> {
    return this.http.get<DirectedGraph>(this.url.masks, this.httpOptions);
  }

  updateGraphLayout(data: DirectedGraph): Observable<DirectedGraph> {
    return this.http.put<DirectedGraph>(`${this.url.graphs}/${data.graphName}/outlook`, data, this.httpOptions);
  }
}
