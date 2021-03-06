import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, pipe, of } from 'rxjs';
import { User } from '../_model/User';
import { PaginatedResult } from '../_model/Pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_model/message';
import { Response } from 'selenium-webdriver/http';


// const httpOptions = {
//   headers: new HttpHeaders({
//       'Authorization': 'Bearer ' + localStorage.getItem('token')
//     })
// };


@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl;

constructor(private http: HttpClient) {}

getUsers(page?, itemPerPage? , userPrams?, likesParams?): Observable<PaginatedResult<User[]>>
{
  const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
 
  let params = new HttpParams();

  if (page != null && itemPerPage != null)
  {
    params = params.append('pageNumber' , page);
    params = params.append('pageSize' , itemPerPage);
  }

  if (userPrams != null)
  {
    params = params.append('minAge' , userPrams.minAge);
    params = params.append('maxAge' , userPrams.maxAge);
    params = params.append('gender' , userPrams.gender);
    params = params.append('orderBy' , userPrams.orderBy);
    
  }

  // params is sent to servver for paginated Result.
  // Pipe function will format the response in 2 part , get body result and save in saperate varialble and get pagination value from header and save in seperate variable.
  
  if(likesParams === 'Likers')
  {
    params = params.append('likers' , 'true');
  }

  if(likesParams === 'Likees')
  {
    params = params.append('likees' , 'true');
  }

  return this.http.get<User[]>(this.baseUrl + 'users/' , { observe: 'response' , params}) //httpOptions
    .pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null)
        {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
}

getUser(id): Observable<User>
{
  return this.http.get<User>(this.baseUrl + 'users/' + id  ); // httpOptions
}

updateUser(id: number , user: User)
{
  return this.http.put(this.baseUrl + 'users/' + id , user);
}

SetMainPhoto(userID: number , id: number)
{
  return this.http.post(this.baseUrl + 'user/' + userID + '/photos/' + id + '/setMain' , {})
  // Send Empty onject as The Request Body
}

deletePhoto(userID: number , id: number)
{
  return this.http.delete(this.baseUrl + 'user/' + userID + '/photos/' + id );
}


sendLike (id: number, recipientId: number)
{
  return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {}); // Empty object {}
}

getMessages(id: number , page? , itemPerPage? , messageContainer? ,)
{
  const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
  let params = new HttpParams();

  if (page != null && itemPerPage != null)
  {
    params = params.append('pageNumber' , page);
    params = params.append('pageSize' , itemPerPage);
    params = params.append('messageContainer' , messageContainer);
    
  }

  return this.http.get<Message[]>(this.baseUrl + 'users/' + id + "/messages", {observe: 'response' , params})
  .pipe(
    map(response => {
      paginatedResult.result = response.body;
      if(response.headers.get('Pagination') !== null)
      {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginatedResult;
  })
  );
}

getMessageThread(id: number , recipientId: number)
{
  return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);
}

sendMessage(id: number , message: Message)
{
  return this.http.post(this.baseUrl + 'users/' + id + '/messages'  , message);
}

deleteMessages(id: number , userId: number)
{
  return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
}

markAsRead(userId: number , messageId: number)
{
  this.http.post(this.baseUrl + 'users/'  + userId + '/messages/' + messageId + '/read' , {})
  .subscribe(); // simply just execute the method here.
}

}
