import { Component, ElementRef, ViewChild } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from 'src/app/models/group.model';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Subject } from 'src/app/models/subject.model';
import { SubjectService } from 'src/app/services/subject.service';
import { ScheduleSlot } from 'src/app/models/schedule-slot.model';
import { ScheduleSlotService } from 'src/app/services/schedule-slot.service';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html'
})
export class ScheduleComponent {
  @ViewChild('firstInput') firstInput: ElementRef;

  groupId: string;
  subjectId: string;
  count: number;

  groups: Group[] = [];
  subjects: Subject[] = [];
  slots: ScheduleSlot[] = [];

  model: Group = {
    id: null,
    name: ''
  };

  constructor(
    private scheduleService: ScheduleService,
    private scheduleSlotService: ScheduleSlotService,
    public groupService: GroupService,
    public subjectService: SubjectService,
    public roomService: RoomService,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.groups = this.groupService.getAll();
    this.subjects = this.subjectService.getAll();
    this.slots = this.getSortedSlots();
  }

  ngAfterViewInit() {
  }

  goToList(): void {
    this.router.navigate(['/']);
  }

  generate(): void {
    this.scheduleService.scheduleGroupSubject(this.groupId, this.subjectId, this.count);
    this.slots = this.getSortedSlots();
  }

  delete(): void {
    // delete all
    this.scheduleSlotService.deleteByGroupAndSubject(this.groupId, this.subjectId);
    this.slots = this.getSortedSlots();
  }

  getSortedSlots(): ScheduleSlot[] {
    let slots: ScheduleSlot[] =  this.scheduleSlotService.getAll();
    if (!this.userService.isCurrentUserAdmin()) {
      slots = slots.filter(s => s.userId == this.userService.getSessionUser()?.id);
    }
    slots.sort((a, b) => {
      const dow: number = a.dayOfWeek - b.dayOfWeek;
      if (dow !== 0) return dow;

      // day of week is the same, so compare by slot number
      const slot: number = a.slotNumber - b.slotNumber;
      if (slot !== 0) return slot;

      // day of week and slot the same, so compare by group
      return Number.parseInt(a?.groupId || '')  - Number.parseInt(b?.groupId || '');
    });

    return slots;
  }
  
  saveApprovedState(slot: ScheduleSlot): void {
    // save slot approved state
    this.scheduleSlotService.update(slot.id, slot).subscribe();
  }

  getDow(dow: number) {
    switch (dow) {
      case 1:
        return 'Понеділок';
      case 2:
        return 'Вівторок';
      case 3:
        return 'Середа';
      case 4:
        return 'Четвер';
      case 5:
        return 'П\'ятниця';
      default:
        return 'Невідомий:' + dow;
    }
  }
}
