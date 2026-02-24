import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from '../../environments/environment';

export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  joinDate: string;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  count?: number;
  message?: string;
  errors?: string[];
}

@Injectable()
export class EmployeeService {
  private apiUrl = environment.apiUrl + '/employees';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  // Get all employees
  getAll(): Observable<Employee[]> {
    return this.http.get(this.apiUrl)
      .map((res: Response) => {
        const response: ApiResponse = res.json();
        return response.data || [];
      })
      .catch(this.handleError);
  }

  // Get employee by ID
  getById(id: number): Observable<Employee> {
    return this.http.get(`${this.apiUrl}/${id}`)
      .map((res: Response) => {
        const response: ApiResponse = res.json();
        return response.data;
      })
      .catch(this.handleError);
  }

  // Create new employee
  create(employee: Employee): Observable<Employee> {
    return this.http.post(this.apiUrl, JSON.stringify(employee), this.options)
      .map((res: Response) => {
        const response: ApiResponse = res.json();
        return response.data;
      })
      .catch(this.handleError);
  }

  // Update employee
  update(id: number, employee: Employee): Observable<Employee> {
    return this.http.put(`${this.apiUrl}/${id}`, JSON.stringify(employee), this.options)
      .map((res: Response) => {
        const response: ApiResponse = res.json();
        return response.data;
      })
      .catch(this.handleError);
  }

  // Delete employee
  delete(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .map((res: Response) => true)
      .catch(this.handleError);
  }

  // Error handler
  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      errMsg = body.message || JSON.stringify(body);
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error('API Error:', errMsg);
    return Observable.throw(errMsg);
  }
}