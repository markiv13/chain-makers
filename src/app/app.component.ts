import {Component, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: '#app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Sparta';
}
