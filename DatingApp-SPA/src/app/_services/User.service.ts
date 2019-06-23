import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { User } from '../_model/User';
import { PaginatedResult } from '../_model/Pagination';
import { map } from 'rxjs/operators';


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

getUsers(page?, itemPerPage? , userPrams?): Observable<PaginatedResult<User[]>>
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
}
