import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/Auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // @Input() valuesFromHome: any; // Recieve Data from Parent (home) into child (Register) : input
  @Output() cancelRegister =   new EventEmitter(); // Send Data from Child(register) to (parent)Home : output 

  model: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.model).subscribe(next => {
    console.log(this.model + ' is Registered');
  } , error => {
    console.log(error);
  })
  }

  cancel() {
    this.cancelRegister.emit(false);
    console.log('cancelled');
  }
}
