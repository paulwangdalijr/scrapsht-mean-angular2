import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { BlogService } from '../../../services/blog.service';
import { BlogComponent } from '../blog.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
  
  message;
  messageClass;
  form;
  currentUrl;
  formShow;
  blog = {
    title: String,
    body: String
  };


  constructor(
  	private formBuilder: FormBuilder,
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  	) { 
  }

  ngOnInit() {
  	this.currentUrl = this.activatedRoute.snapshot.params;
  	this.blogService.getSingleBlog(this.currentUrl.id).subscribe((data:any)=>{
      if(data.success){
        this.blog = data.blog;
        this.form.get('title').setValue(this.blog.title);
        this.form.get('body').setValue(this.blog.body);
        this.formShow = true;

        this.enableBlogForm();
      }else{
        this.formShow = false;
    		this.message = "Bad cheetah! This ain't yo blog";
        this.messageClass = "alert alert-danger";
      }
  	});


    this.editBlogForm();
  }

  editBlogForm(){
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.blogService.alphaNumericValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])],
    })
  }

  enableBlogForm(){
    // this.form.get('title').enable();
    this.form.enable();
  }
  disableBlogForm(){
    this.form.disable();
  }

  onBlogSubmit(){
    let title = this.form.get('title').value;
    let body = this.form.get('body').value;

    if(this.blog.title === title && this.blog.body === body){
      this.messageClass = 'alert alert-danger'
      this.message = "Ooops, you haven't updated anything"
      return;
    }

    this.disableBlogForm();
    const blog = {
      _id: this.currentUrl.id,
      title: title,
      body: body
    }
    this.blogService.updateBlog(blog).subscribe((data:any)=>{
      if(data.success){
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout( () => {
          this.router.navigate(['/blog']);
        }, 1000)

      }else{
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        setTimeout( () => {
          this.router.navigate(['/blog']);
        }, 1000)
      }
    });
  }
  onBlogCancel(){
    this.router.navigate(['/blog']);
  }

}
