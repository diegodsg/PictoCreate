import { Component } from '@angular/core';

/**
 * Generated class for the FilterSearchComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'filter-search',
  templateUrl: 'filter-search.html'
})
export class FilterSearchComponent {

  text: string;

  constructor() {
    console.log('Hello FilterSearchComponent Component');
    this.text = 'Hello World';
  }

}
