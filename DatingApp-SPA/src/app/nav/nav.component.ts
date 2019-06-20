import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/Auth.service';
import { AlertifyServiceService } from '../_services/AlertifyService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {}; // Empty Object
  photoUrl: string;
  constructor(public authService: AuthService , private alertify: AlertifyServiceService , 
    private router: Router) {
   }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }


  login(){
    console.log(this.model);
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success('Logged in successfully');
      console.log('Logged in successfully');

    }, error => {
      this.alertify.error(error);
      console.log(error);
    }, () => {
        this.router.navigate(['/members']);
    });
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
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    console.log('logged out');
    this.alertify.message('logged out');
    this.router.navigate(['/home']);
  }
}
