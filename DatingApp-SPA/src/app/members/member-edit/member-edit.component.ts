import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_model/User';
import { ActivatedRoute } from '@angular/router';
import { AlertifyServiceService } from 'src/app/_services/AlertifyService.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/User.service';
import { AuthService } from 'src/app/_services/Auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm') editForm: NgForm; // Acccess Html Tag
  user: User;

  // @HostListener('Window:beforeunload' , ['$event'])
  // @HostListener('window:beforeunload')
  // unloadNotification($event: any)
  // {
  //   if(this.editForm.dirty)
  //   {
  //     $event.returnValue = true;
  //   }
  // }

  constructor(private route: ActivatedRoute , 
    private alertify: AlertifyServiceService,
    private userService: UserService , private authService: AuthService) 
  {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
  }

  updateUser()
  {
    this.userService.updateUser(this.authService.decodedToken.nameid , this.user).subscribe(next => {
      console.log(this.user);
      this.alertify.success('Profile updated successfully');
      this.editForm.reset(this.user);
    } , error => {
      this.alertify.error(error);
    });
  }
}
