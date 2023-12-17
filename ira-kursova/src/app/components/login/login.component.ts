import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  @ViewChild('firstInput') firstInput: ElementRef;

  email: string = '';
  password: string = '';

  showInvalidDataMessage: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.firstInput.nativeElement.focus();
  }

  login(): void {
    this.userService
      .login(this.email, this.password)
      .subscribe({
        next: (validUser) => {
          if (validUser) {
            this.showInvalidDataMessage = false;

            // login successfull
            this.router.navigate(['']);
          }
          else {
            this.showInvalidDataMessage = true;
          }
        },
        error: (e) => console.error(e)
      });
  }

  
}
