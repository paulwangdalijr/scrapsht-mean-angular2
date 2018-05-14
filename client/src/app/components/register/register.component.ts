import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  
                
  message: String;
  messageClass: String;
  processing: boolean = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  constructor(
                private authService: AuthService,
                private formBuilder: FormBuilder,
                private router: Router
             ){ 
    this.createForm()
  }

  onRegisterSubmit(){
    this.processing = true;
    this.disableForm();
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }
    this.authService.registerUser(user).subscribe( (data:any) => {
      if( !data.success ){
        this.messageClass = 'alert alert-danger';
        this.processing = false;
        this.enableForm();
      }else{
        this.messageClass = 'alert alert-success';
        setTimeout( () => {
          this.router.navigate(['/login']);
        }, 1000)
      }
      this.message = data.message;
    });
  }

  checkUsername(){
    if(!this.form.get('username').errors){
      this.authService.checkUsername(this.form.get('username').value).subscribe( (data:any) => {
        if(!data.success){
          this.usernameValid = false;
        }else{
          this.usernameValid = true;
        }
        this.usernameMessage = data.message;
      })
    }else{
      this.usernameMessage = ""
    }
  }

  checkEmail(){
    if(!this.form.get('email').errors){
      this.authService.checkEmail(this.form.get('email').value).subscribe( (data:any) => {
        if(!data.success){
          this.emailValid = false;
        }else{
          this.emailValid = true;
        }
        this.emailMessage = data.message;
      })
    }else{
      this.emailMessage = ""
    }
  }

  createForm(){
    this.form = this.formBuilder.group({
      // Field validators, this will update the form.controls.[control name].errors/valid in the HTML
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      confirm: ['', Validators.required]
    }, 
    //Form validator, this will update the form.valid/form.errors in the HTML
    { 
      validator: this.matchingPasswords('password', 'confirm') 
    })
  }  

  validateEmail(controls){
    const regExp = new RegExp(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    );

    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validateEmail': true }
    }

  }
  validateUsername(controls){
    const regExp = new RegExp(
      /^[a-zA-Z0-9]+$/
    );

    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validateUsername': true }
    }

  }
  validatePassword(controls){
    const regExp = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,35})/
    );

    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validatePassword': true }
    }

  }

  matchingPasswords(password, confirm){
    return(group:FormGroup) => {
      if(group.controls[password].value === group.controls[confirm].value){
        return null;
      }else{
        return { 'matchingPasswords': true }
      }
    }
  } 

  disableForm(){
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }
  enableForm(){
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

  ngOnInit() {
  }

}
