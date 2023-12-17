import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent {
  users?: User[];
  title: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.userService.isCurrentUserAdmin()) {
      this.router.navigate(['schedule']);
    }
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.users = this.userService.getAll().filter(u => u.id !== this.userService.ADMIN_ID);
  }

  refreshList(): void {
    this.getAllUsers();
  }

  editUser(id?: number): void {
    this.router.navigate(id ? ['user', id] : ['user']);
  }

  deleteUser(id: number): void {
    if (!window.confirm('Ви дійсно бажаєте видалити?')) {
      return;
    }
    this.userService.delete(id).subscribe({
      next: (data) => {
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  searchTitle(): void {
    this.users = this.userService.findByTitle(this.title).filter(u => u.id !== this.userService.ADMIN_ID);
  }
}
