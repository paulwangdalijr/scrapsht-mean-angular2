import { Injectable } from '@angular/core';
// import { Http, Headers, RequestOptions } from '@angular/http';
// import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

// import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  domain = 'http://localhost:8080'; //dev
  // domain = ''; //prod
  authToken;
  user;
  options;

  jwtHelper;

  constructor(
    private http: HttpClient
  ) {
    this.jwtHelper = new JwtHelperService();
   }

  createAuthenticationHeaders(){
    this.loadToken();
    this.options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.authToken
      })
    }
  }

  loadToken(){
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  registerUser(user){    
    return this.http.post(this.domain + '/authentication/register', user);         
  }

  checkUsername(username){    
    return this.http.get(this.domain + '/authentication/checkUsername/' + username);         
  }
  checkEmail(email){    
    return this.http.get(this.domain + '/authentication/checkEmail/' + email);         
  }

  login(user){
    return this.http.post(this.domain + '/authentication/login', user);   
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  storeUserData(token, user){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this.authToken = token;
    this.user = user;
  }

  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + "/authentication/profile", this.options);
  }

  loggedIn(){
    // return tokenNotExpired();'
    // console.log(this.authToken);
    this.loadToken();
    const x = this.jwtHelper.isTokenExpired(this.authToken);
    // console.log(x);
    // return !this.jwtHelper.isTokenExpired(this.authToken);
    return !x;
  }
}
