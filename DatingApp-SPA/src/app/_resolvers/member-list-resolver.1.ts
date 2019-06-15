import { Injectable } from "@angular/core";
import { User } from '../_model/User';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../_services/User.service';
import { AlertifyServiceService } from '../_services/AlertifyService.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberListResolver implements Resolve<User[]>
{

    constructor(private userService: UserService ,
        private router: Router , private alertify: AlertifyServiceService)
    {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> 
    {
        return this.userService.getUsers().pipe( 
            catchError (error => {
                this.alertify.error('Problem Retrieving Data');
                this.router.navigate(['/home']);
                return of(null);
        })
        );
    }
}