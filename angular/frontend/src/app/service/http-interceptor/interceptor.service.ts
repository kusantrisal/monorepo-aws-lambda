import { HttpInterceptor, HttpErrorResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../storage/storage.service';


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private storageService: StorageService) { }
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    if (req.withCredentials) {
      return next.handle(req);
    }

    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
      }
    });

    return next.handle(tokenizedReq)
      .pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handle401Error(req, next);
          }
          return throwError(error.message);
        }
        ));
  }

  //the magic of refreshing token.
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    console.log('Refreshing token')
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;
          this.storageService.saveTokenInSessionStorage(res.access_token, res.refresh_token, res.expires);
          this.refreshTokenSubject.next(res.access_token);
          return next.handle(this.addToken(request, res.access_token));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

}
