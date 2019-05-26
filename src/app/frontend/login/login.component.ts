import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/service/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private el: ElementRef
  ) { }

  ngOnInit() {
    if (localStorage.getItem('access_token')) {
      this.router.navigate(['/admin']);
    }
  }

  togglePassword(input: any) {
    this.authService.togglePassword(input);
  }

  onLogin() {
    const user = {
      userID: this.username,
      username: this.username,
      password: this.password
    };

    if (user.username && user.password) {
      this.authService.authenticateUser(user)
        .subscribe((data: any) => {
          console.log(data);
          if (data.result == "Login Success") {
            data.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2F1cmF2IiwidXNlcm5hbWUiOiJzYXVyYXYiLCJ1c2VyX3R5cGUiOiJwcm92aWRlciJ9.D2BE7mlXiwY6TUNBtgEd7EA4TB7QV9ZR-6M8OibIKRw";
            data.user = {
              "name": this.username,
              "username": this.username
            };
            this.authService.storeUserData(data.token, data.user);
            // this.flashMessage.show("You are now logged in", { cssClass: 'alert alert-success', timeout: 5000 });
            this.router.navigate(['/admin']);
          } else {
            $('#showLoginErrorMsg').text(data.result);
            // this.flashMessage.show(data.result, { cssClass: 'alert alert-danger', timeout: 5000 });
            setTimeout(function () {
              $('#showLoginErrorMsg').fadeOut('fast');
            }, 8000); 
            this.router.navigate(['/home']);
          }
        });

    }

  }

}
