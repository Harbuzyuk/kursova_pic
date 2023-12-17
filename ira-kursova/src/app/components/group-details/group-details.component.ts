import { Component, ElementRef, ViewChild } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from 'src/app/models/group.model';

@Component({
  selector: 'group-details',
  templateUrl: './group-details.component.html'
})
export class GroupDetailsComponent {
  @ViewChild('firstInput') firstInput: ElementRef;

  model: Group = {
    id: null,
    name: ''
  };

  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.get(this.route.snapshot.params['id']);
  }
  ngAfterViewInit() {
    this.firstInput.nativeElement.focus();
  }

  goToList(): void {
    this.router.navigate(['/groups']);
  }

  get(id: string): void {
    if (!id) {
      return;
    }
    this.groupService.get(id).subscribe({
      next: (data) => {
        this.model = data;
      },
      error: (e) => console.error(e)
    });
  }

  save(): void {
    this.groupService
      .update(this.model.id, this.model)
      .subscribe({
        next: (res) => {
          this.goToList();
        },
        error: (e) => console.error(e)
      });
  }

  delete(): void {
    if (!window.confirm('Ви дійсно бажаєте видалити?')) {
      return;
    }

    this.groupService.delete(this.model.id).subscribe({
      next: (res) => {
        this.goToList();
      },
      error: (e) => console.error(e)
    });
  }
}
