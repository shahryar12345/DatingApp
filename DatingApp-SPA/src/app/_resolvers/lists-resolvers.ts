import { Injectable } from "@angular/core";
import { User } from '../_model/User';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/User.service';
import { AlertifyServiceService } from '../_services/AlertifyService.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaginatedResult } from '../_model/Pagination';

@Injectable()
export class ListResolver implements Resolve<PaginatedResult<User[]>>
{
    pageNumber = 1;
    pageSize = 5;
    likesPram = 'Likers';

    constructor(private userService: UserService ,
                private router: Router , private alertify: AlertifyServiceService)
    {}
    // Observable<User[]>
    resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<User[]>>
    {
        return this.userService.getUsers(this.pageNumber , this.pageSize , null , this.likesPram).pipe(
            catchError (() => {
                this.alertify.error('Problem Retrieving Data');
                this.router.navigate(['/home']);
                return of(null);
        })
        );
    }
}
