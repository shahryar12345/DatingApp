import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/Auth.service';
import {JwtHelperService } from '@auth0/angular-jwt';
import { AlertifyServiceService } from './_services/AlertifyService.service';
import { User } from './_model/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'DatingApp-SPA';
  jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService , private alertify: AlertifyServiceService)
  {

  }
  ngOnInit() {
      const token = localStorage.getItem('token'); 
      const user: User = JSON.parse(localStorage.getItem('user'));
      if(token)
      {
        this.authService.decodedToken = this.jwtHelper.decodeToken(token);
        //  this.alertify.error('  '+ token);
        //  this.alertify.error('  '+ user.age);
      }

      if(user)
      {
        this.authService.currentUser = user;
        this.authService.chanageMemberPhoto(user.photoUrl);
      }
  }
}
