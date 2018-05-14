import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { BlogService } from '../../../services/blog.service';
import { BlogComponent } from '../blog.component';
import { ActivatedRoute } from '@angular/router';

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
  blog = {
    title: String,
    body: String
  };

  constructor(
  	private formBuilder: FormBuilder,
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute
  	) { 
  	this.editBlogForm();
  }

  ngOnInit() {
  	this.currentUrl = this.activatedRoute.snapshot.params;
  	this.blogService.getSingleBlog(this.currentUrl.id).subscribe((data:any)=>{
      if(data.success){
        this.blog = data.blog;
        this.form.get('title').setValue(this.blog.title);
        this.form.get('body').setValue(this.blog.body);
      }else{
    		this.message = "Blog not found!";
        this.messageClass = "alert alert-danger";
      }
  	});
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

}
