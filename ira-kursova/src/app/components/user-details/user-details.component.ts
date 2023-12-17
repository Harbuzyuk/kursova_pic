import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Subject } from 'src/app/models/subject.model';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent {
  @ViewChild('firstInput') firstInput: ElementRef;

  subjects: Subject[] = [];

  model: User = {
    id: null,
    firstName: '',
    lastName: '',
    email: ''
  };

  constructor(
    private userService: UserService,
    private subjectService: SubjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.get(this.route.snapshot.params['id']);
    this.subjects = this.subjectService.getAll();
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
    this.userService
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

    this.userService.delete(this.model.id).subscribe({
      next: (res) => {
        this.goToList();
      },
      error: (e) => console.error(e)
    });
  }
}
