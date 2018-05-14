import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username;
  email;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe( (profile:any) => {
      if(profile.success){        
        this.username = profile.user.username;
        this.email = profile.user.email;
      }else{
        this.authService.logout();
        this.router.navigate(['/']);
      }
    });
  }

}
