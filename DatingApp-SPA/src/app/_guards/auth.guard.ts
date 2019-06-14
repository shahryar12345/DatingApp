import { Injectable } from '@angular/core';
import { UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/Auth.service';
import { AlertifyServiceService } from '../_services/AlertifyService.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanActivate{
  // this function can return any Any in between these 3 values
  
  constructor(private authService: AuthService , private router: Router , private alertify: AlertifyServiceService)  
  {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean
  {
    if(this.authService.loggedIn()){
    return true;
    }
    this.alertify.error('You Shall Not Pass..!!!');
    this.router.navigate(['/home']);
    return false;
  }

}
