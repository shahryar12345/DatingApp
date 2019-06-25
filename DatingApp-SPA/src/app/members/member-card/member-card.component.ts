import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_model/User';
import { AuthService } from 'src/app/_services/Auth.service';
import { UserService } from 'src/app/_services/User.service';
import { AlertifyServiceService } from 'src/app/_services/AlertifyService.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  
  @Input() user: User;

  constructor(private authService: AuthService , private userService: UserService,
    private alertify: AlertifyServiceService) { }

  ngOnInit() {
  }

  sendLike(id: number)
  {
    this.userService.sendLike(this.authService.decodedToken.nameid , id).subscribe(date => {
      this.alertify.success('You Have Liked ' + this.user.knownAs);
    } , error => {
      this.alertify.error(error);
    })
  }
  
}
