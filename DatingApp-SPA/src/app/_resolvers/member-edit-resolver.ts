import { Injectable } from "@angular/core";
import { User } from '../_model/User';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../_services/User.service';
import { AlertifyServiceService } from '../_services/AlertifyService.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/Auth.service';

@Injectable()
export class MemberEditResolver implements Resolve<User>
{

    constructor(private userService: UserService ,
        private router: Router , private alertify: AlertifyServiceService,
        private authService: AuthService)
    {}

    // in edit case we extract Id from over localstorage token
    resolve(route: ActivatedRouteSnapshot): Observable<User>
    {
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError (error => {
                this.alertify.error('Problem Retrieving Your Data For Edit.');
                this.router.navigate(['/home']);
                return of(null);
        })
        );
    }
}