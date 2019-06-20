import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_model/Photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/Auth.service';
import { AlertifyServiceService } from 'src/app/_services/AlertifyService.service';
import { UserService } from 'src/app/_services/User.service';
import { JsonPipe } from '@angular/common';

 
// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() GetMemberPhotoChange = new EventEmitter<string>();
   
   uploader: FileUploader;
   hasBaseDropZoneOver = false;
   baseUrl  = environment.apiUrl;
   currentMainPhoto: Photo;

   constructor(private autheservice: AuthService , 
    private alertify: AlertifyServiceService,
    private userService: UserService) { }

  ngOnInit() {
      this.initializeUploader();
      
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }


  initializeUploader()
  {
    this.uploader = new FileUploader({
      url: this.baseUrl  + 'user/' + this.autheservice.decodedToken
      .nameid + '/photos' , 
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false; };
    this.uploader.onSuccessItem = (item , response , status , headers) => 
    {
      if(response)
      {
        const res: Photo = JSON.parse(response);
        // const photo = {
        //   id: res.id,
        //   url: res.url,
        //   dateAdded: res.dateAdded,
        //   description: res.description,
        //   inMain: res.isMain
        // };
        this.photos.push(res);
      }
    };
  }

  SetMainPhoto(photo: Photo)
  {
    this.userService.SetMainPhoto(this.autheservice.decodedToken.nameid , photo.id).subscribe(() => {
      this.currentMainPhoto = this.photos.filter(x => x.isMain)[0]; // filler return filltered Array
      this.currentMainPhoto.isMain = false;
      photo.isMain = true;
      this.alertify.success('Set Successfully');
      //this.GetMemberPhotoChange.emit(photo.url);
      this.autheservice.chanageMemberPhoto(photo.url);
      this.autheservice.currentUser.photoUrl = photo.url;
      localStorage.setItem('user' , JSON.stringify(this.autheservice.currentUser));
      console.log('Set');
    } , error => {
      this.alertify.error('Error');
    });
  }

  deletePhoto(id: number)
  {
    this.alertify.confirm('Are You Sure You Want to Delete' , () =>
    {
      this.userService.deletePhoto(this.autheservice.decodedToken.nameid , id).subscribe( () => {
        this.photos.splice(this.photos.findIndex(p => p.id === id) , 1);
        this.alertify.success('Photo has been deleted');
      } , error => {
        this.alertify.error(error);
      });
    })
  }
}
