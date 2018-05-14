import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingBlog = false;
  form;
  processing = false;
  username ;
  blogs;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService
  ) { 

    console.log("blog component constructor")
  }

  ngOnInit() {

    this.createNewBlogForm();
    this.authService.getProfile().subscribe((profile:any) => {
      this.username = profile.user.username;
    })

    this.reloadBlog();
    console.log("blog component onInit")
    // console.log(this.blogs);
  }

  newBlogForm(){
    this.newPost = true;
  }

  reloadBlog(){
    this.loadingBlog = true;
    this.blogService.getBlogs().subscribe((data:any) => {
      this.blogs = data.blogs;
    });

    setTimeout( () => {
      this.loadingBlog = false;
    }, 4000)
  }

  createNewBlogForm(){
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
    // this.processing = true;
    this.disableBlogForm();

    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.username
    }

    this.blogService.newBlog(blog).subscribe((data:any) => {
      if(data.success){
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.reloadBlog();
        
        setTimeout( ()=>{
          this.newPost = false;
          this.message = "";
          this.messageClass = "";
          this.form.reset();
        }, 2000)
      }else{
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      }
      this.enableBlogForm();
      this.processing = false;
    });
  }

  onBlogCancel(){
    // window.location.reload();
    this.newPost = false;

  }
}
