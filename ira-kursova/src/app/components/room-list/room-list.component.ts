import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from 'src/app/models/room.model';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'room-list',
  templateUrl: './room-list.component.html'
})
export class RoomListComponent {
  rooms?: Room[];
  title: string = '';

  constructor(
    private roomService: RoomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllRooms();
  }

  getAllRooms(): void {
    this.rooms = this.roomService.getAll();
  }

  refreshList(): void {
    this.getAllRooms();
  }

  editRoom(id?: number): void {
    this.router.navigate(id ? ['room', id] : ['room']);
  }

  deleteRoom(id: number): void {
    if (!window.confirm('Ви дійсно бажаєте видалити?')) {
      return;
    }
    this.roomService.delete(id).subscribe({
      next: (data) => {
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  searchTitle(): void {
    this.rooms = this.roomService.findByTitle(this.title);
  }
}
