import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/User.service';
import { AlertifyServiceService } from '../../_services/AlertifyService.service';
import { User } from '../../_model/User';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_model/Pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})

export class MemberListComponent implements OnInit {

  users: User[];
  pagination: Pagination;
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [ {value: 'male' , display: 'Males'} ,
                 {value: 'female' , display: 'Females'} 
                ]
  userParams: any = {};              

  constructor(private userService: UserService ,
     private alertify: AlertifyServiceService,
     private route: ActivatedRoute) { }

  ngOnInit() {
    //this.loadUsers();
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });

    this.userParams.gender = this.user.gender === 'female' ?  'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }

  resetFilters()
  {
    this.userParams.gender = this.user.gender === 'female' ?  'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
    this.loadUsers();
  }

  pageChanged(event: any): void
  {
    this.pagination.currentPage = event.page;
    console.log(this.pagination.currentPage);
    this.loadUsers();
  }

  loadUsers()
  {
    this.userService.getUsers(this.pagination.currentPage 
      , this.pagination.itemPerPage , this.userParams)
    .subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      this.pagination = res.pagination;
    } , error => {
      this.alertify.error(error);
    });
  }
}
