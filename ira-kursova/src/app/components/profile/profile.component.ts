import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { MD5 } from 'md5-js-tools';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  @ViewChild('firstInput') firstInput: ElementRef;

  password: string = '';
  message: string = '';

  model: User = {
    id: null,
    firstName: '',
    lastName: '',
    email: ''
  };

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    let user: User | null = this.userService.getSessionUser();
    if (user !== null) {
      this.model = user;
    }
  }
  ngAfterViewInit() {
    this.firstInput.nativeElement.focus();
  }

  goToList(): void {
    this.router.navigate(['/users']);
  }

  get(id: string): void {
    if (!id) {
      return;
    }
    this.userService.get(id).subscribe({
      next: (data) => {
        this.model = data;
      },
      error: (e) => console.error(e)
    });
  }

  save(): void {
    if (this.password != '') {
      // do not set new password if it is empty
      this.model.password = MD5.generate(this.password);
    }

    this.userService
      .update(this.model.id, this.model)
      .subscribe({
        next: (res) => {
         this.message = 'Зміни успішно записані.';
        },
        error: (e) => console.error(e)
      });
  }

  delete(): void {
    if (!window.confirm('Ви дійсно бажаєте видалити?')) {
      return;
    }

    this.userService.delete(this.model.id).subscribe({
      next: (res) => {
        this.goToList();
      },
      error: (e) => console.error(e)
    });
  }
}
