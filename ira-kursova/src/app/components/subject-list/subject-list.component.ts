import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'src/app/models/subject.model';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'subject-list',
  templateUrl: './subject-list.component.html'
})
export class SubjectListComponent {
  subjects?: Subject[];
  title: string = '';

  constructor(
    private subjectService: SubjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllSubjects();
  }

  getAllSubjects(): void {
    this.subjects = this.subjectService.getAll();
  }

  refreshList(): void {
    this.getAllSubjects();
  }

  editSubject(id?: number): void {
    this.router.navigate(id ? ['subject', id] : ['subject']);
  }

  deleteSubject(id: number): void {
    if (!window.confirm('Ви дійсно бажаєте видалити?')) {
      return;
    }
    this.subjectService.delete(id).subscribe({
      next: (data) => {
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  searchTitle(): void {
    this.subjects = this.subjectService.findByTitle(this.title);
  }
}
