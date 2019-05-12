import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  showServiceDetails: boolean = false;
  serviceId: string;
  pdfUrl: string="";

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.route.params.subscribe( params => this.pdfUrl = params.pdfUrl);
    console.log("this.pdfUrl----",this.pdfUrl);

    this.serviceId = this.route.snapshot.params['id'];
    if (this.serviceId) {
      this.showServiceDetails = false;
    } else this.showServiceDetails = true;
  }


}
