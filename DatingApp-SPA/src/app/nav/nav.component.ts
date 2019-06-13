import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/Auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {}; // Empty Object
  constructor(private authService: AuthService) {
   }

  ngOnInit() {
  }


  login(){
    console.log(this.model);
    this.authService.login(this.model).subscribe(next => {
      console.log('Logged in successfully');
    }, error => {
      console.log(error);
    })
  }

  loggedIn()
  {
    const token = localStorage.getItem('token');
    return !!token; // Short hand of IfElse , retunr true or fasle
  }

  logout(){
    localStorage.removeItem('token');
    console.log('logged out');
  }
}