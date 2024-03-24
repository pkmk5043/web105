import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

    private apiUrl = 'http://localhost:3000/api/data'; // Your backend API URL
  
    constructor(private http: HttpClient) { }
  
    getData(): Observable<any> {
      return this.http.get<any>(this.apiUrl);
    }
  
    postData(data: any): Observable<any> {
      return this.http.post<any>(this.apiUrl, data);
    }
}
