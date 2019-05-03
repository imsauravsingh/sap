import { Component, OnInit } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.css']
})
export class FrontendComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      $('.preloader-wrapper').fadeOut();
  }

}
