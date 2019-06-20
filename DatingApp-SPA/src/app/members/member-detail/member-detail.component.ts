import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_model/User';
import { UserService } from 'src/app/_services/User.service';
import { AlertifyServiceService } from 'src/app/_services/AlertifyService.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  user: User;
  gelleryOptions: NgxGalleryOptions [];
  gelleryImages: NgxGalleryImage [];

  constructor(private UserSerivce: UserService,
    private alertify: AlertifyServiceService,
    private route: ActivatedRoute) { }

  ngOnInit()
  {
    //this.loadUser();

    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

    this.gelleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 10,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: true
      }
    ];

    this.gelleryImages = this.getImage()
  }

getImage() {
  const imageUrls = [];
  for(let i = 0; i < this.user.photos.length; i++)
  {
    imageUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description
    });
  }
  return imageUrls;
}
  
  // This msg is work fine but we Use resolver in this case, resolver is used to 
  // retrive Data from server in a route , before desplaying it to html page. 
  // If resolver Used so we have no need to use SAVE NEVIGATION OPERATOR (?) is HTML page
  // loadUser()
  // {
  //   this.UserSerivce.getUser(+this.route.snapshot.params['id'])
  //   .subscribe((user: User) => {
  //     this.user = user;
  //   }, error => {
  //     this.alertify.error(error);
  //   });
  // }
}
