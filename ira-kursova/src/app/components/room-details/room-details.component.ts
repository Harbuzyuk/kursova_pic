import { Component, ElementRef, ViewChild } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from 'src/app/models/room.model';

@Component({
  selector: 'room-details',
  templateUrl: './room-details.component.html'
})
export class RoomDetailsComponent {
  @ViewChild('firstInput') firstInput: ElementRef;

  model: Room = {
    id: null,
    name: '',
    corpus: '',
    floor: 1
  };

  constructor(
    private roomService: RoomService,
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
    this.router.navigate(['/rooms']);
  }

  get(id: string): void {
    if (!id) {
      return;
    }
    this.roomService.get(id).subscribe({
      next: (data) => {
        this.model = data;
      },
      error: (e) => console.error(e)
    });
  }

  save(): void {
    this.roomService
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

    this.roomService.delete(this.model.id).subscribe({
      next: (res) => {
        this.goToList();
      },
      error: (e) => console.error(e)
    });
  }
}
