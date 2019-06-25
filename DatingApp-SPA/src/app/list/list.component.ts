import { Component, OnInit } from '@angular/core';
import { User } from '../_model/User';
import { Pagination, PaginatedResult } from '../_model/Pagination';
import { AlertifyServiceService } from '../_services/AlertifyService.service';
import { UserService } from '../_services/User.service';
import { ActivatedRoute } from '@angular/router';
import { AuthGuard } from '../_guards/auth.guard';
import { AuthService } from '../_services/Auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  users : User[];
  pagination: Pagination;
  likesParam: string;
  
  constructor(private userService: UserService ,
    private alertify: AlertifyServiceService,
    private route: ActivatedRoute , private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
    this.users = data['users'].result; // 'users' is returning from routes file resolve {users : resolvername}
    this.pagination = data['users'].pagination; 
    });

    this.likesParam = 'Likers';
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
      , this.pagination.itemPerPage ,  null , this.likesParam)
    .subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      this.pagination = res.pagination;
    } , error => {
      this.alertify.error(error);
    });
  }



}
