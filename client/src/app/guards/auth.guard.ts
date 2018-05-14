import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';
import { AuthService }      from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    redirectURL;

    constructor(
        private authService: AuthService, 
        private router: Router
        ) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     let url: string = state.url;

    
//   }
    canActivate(
        router: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ){
        if(this.authService.loggedIn()){
            return true;
        }else{
            this.redirectURL = state.url;
            this.router.navigate(['/login']);
            return false;
        }
    }

}