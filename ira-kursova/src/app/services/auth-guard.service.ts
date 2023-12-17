import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map} from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private userService: UserService, private route: Router) { }

  canActivate() {
    let loggedIn: boolean = this.userService.getSessionUser() != null;
    if (!loggedIn) {
        this.route.navigate(['/login']);  
    }
    return loggedIn;
  }
} 