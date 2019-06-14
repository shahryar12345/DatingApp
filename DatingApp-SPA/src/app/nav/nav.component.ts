import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/Auth.service';
import { AlertifyServiceService } from '../_services/AlertifyService.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {}; // Empty Object
  constructor(public authService: AuthService , private alertify: AlertifyServiceService) {
   }

  ngOnInit() {
  }


  login(){
    console.log(this.model);
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success('Logged in successfully');
      console.log('Logged in successfully');
    }, error => {
      this.alertify.error(error);
      console.log(error);
    })
  }

  loggedIn()
  {
    //const token = localStorage.getItem('token');
    //return !!token; // Short hand of IfElse , retunr true or fasle
    // Above code is also working , when we not use JWThelper Lib

     return this.authService.loggedIn(); 
     // this method is used because we use JWThelper liberary which check token jwt format and its expiry.
  }

  logout(){
    localStorage.removeItem('token');
    console.log('logged out');
    this.alertify.message('logged out');
  }
}
