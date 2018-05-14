import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  // options;
  // domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  // createAuthenticationHeaders(){
  //   this.authService.loadToken();
  //   this.options = {
  //     headers: new HttpHeaders({
  //       'Content-Type':  'application/json',
  //       'Authorization': this.authService.authToken
  //     })
  //   }
  // }

  newBlog(blog){
    this.authService.createAuthenticationHeaders();
    return this.http.post(this.authService.domain + '/blogs/newPost', blog, this.authService.options);
  }

  getBlogs(){
    this.authService.createAuthenticationHeaders();
    return this.http.get(this.authService.domain + '/blogs/allBlogs', this.authService.options);
  }

  getSingleBlog(id){
    this.authService.createAuthenticationHeaders();
    return this.http.get(this.authService.domain + '/blogs/singleBlog/' + id, this.authService.options);
  }

  alphaNumericValidation(controls){
    const regExp = new RegExp(
      /^[a-zA-Z0-9 ]+$/
    );  
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'alphanumericValidation': true}
    }
  }
}
