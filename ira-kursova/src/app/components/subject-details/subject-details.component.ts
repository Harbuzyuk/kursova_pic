import { Component, ElementRef, ViewChild } from '@angular/core';
import { SubjectService } from 'src/app/services/subject.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'src/app/models/subject.model';

@Component({
  selector: 'subject-details',
  templateUrl: './subject-details.component.html'
})
export class SubjectDetailsComponent {
  @ViewChild('firstInput') firstInput: ElementRef;

  model: Subject = {
    id: null,
    name: ''
  };

  constructor(
    private subjectService: SubjectService,
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
    this.router.navigate(['/subjects']);
  }

  get(id: string): void {
    if (!id) {
      return;
    }
    this.subjectService.get(id).subscribe({
      next: (data) => {
        this.model = data;
      },
      error: (e) => console.error(e)
    });
  }

  save(): void {
    this.subjectService
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

    this.subjectService.delete(this.model.id).subscribe({
      next: (res) => {
        this.goToList();
      },
      error: (e) => console.error(e)
    });
  }
}
