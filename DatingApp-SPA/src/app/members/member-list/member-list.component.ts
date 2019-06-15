import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/User.service';
import { AlertifyServiceService } from '../../_services/AlertifyService.service';
import { User } from '../../_model/User';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})

export class MemberListComponent implements OnInit {

  users: User[];

  constructor(private userService: UserService ,
     private alertify: AlertifyServiceService,
     private route: ActivatedRoute) { }

  ngOnInit() {
    //this.loadUsers();
    this.route.data.subscribe(data => {
      this.users = data['users'];
    })
  }

  // loadUsers()
  // {
  //   this.userService.getUsers().subscribe((users: User[]) => {
  //     this.users = users;
  //   } , error => {
  //     this.alertify.error(error);
  //   });
  // }

}
