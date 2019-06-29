import { Injectable } from "@angular/core";
import { User } from '../_model/User';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/User.service';
import { AlertifyServiceService } from '../_services/AlertifyService.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaginatedResult } from '../_model/Pagination';
import { Message } from '../_model/message';
import { AuthService } from '../_services/Auth.service';

@Injectable()
export class MessagesResolver implements Resolve<PaginatedResult<Message[]>>
{
    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';

    constructor(private userService: UserService ,
                private router: Router 
                , private alertify: AlertifyServiceService
                , private authService: AuthService
                )
    {}
    // Observable<User[]>
    resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<Message[]>>
    {
        return this.userService.getMessages(this.authService.decodedToken.nameid 
            , this.pageNumber , this.pageSize , this.messageContainer).pipe(
            catchError (() => {
                this.alertify.error('Problem Retrieving Messages');
                this.router.navigate(['/home']);
                return of(null);
        })
        );
    }
}
