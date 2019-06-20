import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map} from 'rxjs/operators';
import {JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_model/User';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser : User;
  photoUrl = new BehaviorSubject<string>('../../assests/user.png'); //must initialize this type
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) { }

  chanageMemberPhoto(photoUrl: string)
  {
    this.photoUrl.next(photoUrl); //next Photo set the PhotoUrl
  }

 login(model: any) {

  return this.http.post(this.baseUrl + 'login', model)
    .pipe(
      map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token' , user.token);
            localStorage.setItem('user' , JSON.stringify(user.user));
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            this.currentUser = user.user;
            this.chanageMemberPhoto(this.currentUser.photoUrl);
            console.log(this.decodedToken);
          }
      })
    );
 }

 register(model: any) {
   return this.http.post(this.baseUrl + 'register' , model);
 }

 loggedIn()
 {
   const token = localStorage.getItem('token');
   return !this.jwtHelper.isTokenExpired(token);
 }
}
