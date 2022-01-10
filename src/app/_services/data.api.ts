import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DataApiService {

  apiBaseURL = 'assets/data';
  loadDataURL = null;

  constructor(private http: HttpClient) {
    this.loadDataURL = `${this.apiBaseURL}/chartist/charts/chartist.json`;
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error
      console.error('error:', error.error.message);
    } else {
      // Error
      console.error(
        `Api server returned ${error.status}, ` +
        `error body: ${error.error}`);
    }
    // throwError is observable
    return throwError('Error has happened');
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  getDashboardData(): Observable<any> {
    return this.http.get(this.loadDataURL, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
}
