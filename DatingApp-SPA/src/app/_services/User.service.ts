import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_model/User';


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

getUsers(): Observable<User[]>{
  return this.http.get<User[]>(this.baseUrl + 'users/' ); //httpOptions
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
}
