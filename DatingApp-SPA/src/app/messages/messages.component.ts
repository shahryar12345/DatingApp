import { Component, OnInit } from '@angular/core';
import { Message } from '../_model/message';
import { Pagination, PaginatedResult } from '../_model/Pagination';
import { UserService } from '../_services/User.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertifyServiceService } from '../_services/AlertifyService.service';
import { AuthService } from '../_services/Auth.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  
  constructor(private userService: UserService ,
    private router: Router ,
    private route: ActivatedRoute,
    private alertify: AlertifyServiceService,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.route.data.subscribe(data => 
      {
        this.messages = data['messages'].result;
        this.pagination = data['messages'].pagination;
      });
  }


  loadMessages()
  {
    console.log(this.messageContainer);
    this.userService.getMessages(this.authService.decodedToken.nameid , this.pagination.currentPage , this.pagination.itemPerPage , this.messageContainer)
    .subscribe((res: PaginatedResult<Message[]>) => {
      this.messages = res.result;
      this.pagination = res.pagination;

    }, error  => {
      this.alertify.error(error);
    });
  }

  pageChanged(event: any): void
  {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  deleteMessage(id: number)
  {
    this.alertify.confirm('Are you sure you want to delete message.' , () => {    // Call Bace Function
       this.userService.deleteMessages(id , this.authService.decodedToken.nameid).subscribe( () => { // Annonimous function , because we did not getting anything in respose in this case
        this.messages.splice(this.messages.findIndex(m => m.id === id) , 1);
        this.alertify.success('Message has been deleted');
      } , error => {
        this.alertify.error(error);
      });
     });
  }
}
