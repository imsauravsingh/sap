import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {
  currentLoggedUser:any;

  constructor(private authService: AuthService, private router: Router, private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.currentLoggedUser = this.authService.loadUser();
  }

  onLogout() {
    this.authService.logout();
    // this.flashMessage.show("You are logged out", {
    //   cssClass: "alert alert-success",
    //   timeout: 3000
    // });
    this.router.navigate(['/home']);
  }


}
