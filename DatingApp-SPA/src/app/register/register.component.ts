import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/Auth.service';
import { AlertifyServiceService } from '../_services/AlertifyService.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_model/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // @Input() valuesFromHome: any; // Recieve Data from Parent (home) into child (Register) : input
  @Output() cancelRegister =   new EventEmitter(); // Send Data from Child(register) to (parent)Home : output 

  user: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>; // Partial make it a partial class type , and in partial class all properties are optional.

  constructor(private authService: AuthService ,
    private router: Router,
    private alertify: AlertifyServiceService ,
    private fb: FormBuilder ) { }

  ngOnInit() {
    //Below code is user if reactive form is build without FORMBUILDER
    // this.registerForm = new FormGroup({
    //   username: new FormControl('Hello' , Validators.required),
    //   password: new FormControl('', 
    //   [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('' , Validators.required)
    // } ,
    // this.passwordMatchValidator);
    this.bsConfig =  {
      containerClass: 'theme-red'
    };
    this.createRegisterForm();
  }

  createRegisterForm()
  {
    this.registerForm = this.fb.group({
      gender: ['male' ],
      username: ['' , Validators.required] ,
      knownAs: ['',  Validators.required],
      dateOfBirth: [null ,  Validators.required],
      city: ['' ,  Validators.required],
      country: ['' ,  Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['' , Validators.required]
    }, {validators: this.passwordMatchValidator});
  }

  passwordMatchValidator(g: FormGroup)
  { 
    return g.get('password').value === g.get('confirmPassword').value ? null: {'mismatch': true};
  }


  register() {
    if(this.registerForm.valid){
    
      this.user =  Object.assign({} , this.registerForm.value); // Save registerForm value into user type variable.
      this.authService.register(this.user).subscribe(() => {
        this.alertify.success('Registration Successfull')
      } , error => {
        this.alertify.error(error);
      }, () => {
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }
    // Third Option of subscribe method is COMPLETE

  //   this.authService.register(this.model).subscribe(next => {
  //   console.log(this.model + ' is Registered');
  //   this.alertify.success('Registration Successful');
  // } , error => {
  //   this.alertify.error(error);
  //   console.log(error);
  // })
  console.log(this.registerForm.value);
  }

  cancel() {
    this.cancelRegister.emit(false);
    console.log('cancelled');
  }
}
