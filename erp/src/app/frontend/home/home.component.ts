import { Component, OnInit } from '@angular/core';
import $ from 'jquery';

declare var owlCarouselMethod: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    owlCarouselMethod()
  }

}
