import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_model/message';
import { UserService } from 'src/app/_services/User.service';
import { AlertifyServiceService } from 'src/app/_services/AlertifyService.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/Auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(private UserSerivce: UserService,
    private alertify: AlertifyServiceService,
    private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit() {
    this.loadmessages();
  }



  loadmessages()
  {
    // '+' is used to cast variable in number type
    const currentUserId = +this.authService.decodedToken.nameid;
    this.UserSerivce.getMessageThread(this.authService.decodedToken.nameid , this.recipientId)
    .pipe(
      tap(messages => {
        for (let i =0; i < messages.length; i++)
        {
          if(messages[i].isRead === false && messages[i].recipientId === currentUserId)
          {
            this.UserSerivce.markAsRead(currentUserId, messages[i].id);
          }
        }
      })
    )
    .subscribe(messages => {
      this.messages = messages;
    }, error => this.alertify.error(error));
  }

  sendMessage()
  {
    this.newMessage.recipientId = this.recipientId; 
    this.UserSerivce.sendMessage(this.authService.decodedToken.nameid , this.newMessage)
    .subscribe((message: Message) => {
      this.messages.unshift(message); // Add in end
      this.newMessage.content = '';
    }, error => {
      this.alertify.error(error);
    });
  }
}
