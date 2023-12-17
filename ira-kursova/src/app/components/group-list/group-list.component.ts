import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Group } from 'src/app/models/group.model';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'group-list',
  templateUrl: './group-list.component.html'
})
export class GroupListComponent {
  groups?: Group[];
  title: string = '';

  constructor(
    private groupService: GroupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllGroups();
  }

  getAllGroups(): void {
    this.groups = this.groupService.getAll();
  }

  refreshList(): void {
    this.getAllGroups();
  }

  editGroup(id?: number): void {
    this.router.navigate(id ? ['group', id] : ['group']);
  }

  deleteGroup(id: number): void {
    if (!window.confirm('Ви дійсно бажаєте видалити?')) {
      return;
    }
    this.groupService.delete(id).subscribe({
      next: (data) => {
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  searchTitle(): void {
    this.groups = this.groupService.findByTitle(this.title);
  }
}
