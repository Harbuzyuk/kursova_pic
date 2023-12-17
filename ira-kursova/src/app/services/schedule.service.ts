import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { ScheduleSlot } from '../models/schedule-slot.model';
import { DbService } from './db.service';
import { ScheduleSlotService } from './schedule-slot.service';
import { RoomService } from './room.service';
import { UserService } from './user.service';
import { GroupService } from './group.service';
import { Slot } from '../models/slot.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  TABLE = 'schedule';

  constructor(private http: HttpClient,
    private dbService: DbService,
    private scheduleSlotService: ScheduleSlotService,
    private roomService: RoomService,
    private userService: UserService,
    private groupService: GroupService,
    ) {
  }

  scheduleGroupSubject(groupId: string, subjectId: string, count: number): void {
    // видалити заплановані слоти для групи / дисципліни
    this.scheduleSlotService.deleteByGroupAndSubject(groupId, subjectId);

    // кожен день має по 6 слотів (кожен слот це 1 пара)
    const totalDays: number = 5; // monday - friday
    const numberOfSotsPerDay: number = 6;
    const totalNumberOfSlots: number = totalDays * numberOfSotsPerDay;
    // якщо адмін вказав зробити пару 2 рази на тиждень, то в нас виходить 2 відрізки по 15 пар, і на кожен з цих відрізків треба призначити пару
    const segmentLength: number = Math.floor(totalNumberOfSlots / count); // забрати дріб

    // all currently saved slots
    const slots = this.scheduleSlotService.getAll();

    const schedule: Slot[] = [];
    for (let i = 0; i < totalNumberOfSlots; i++) {
      const item = {
        dayOfWeek: Math.floor(i / numberOfSotsPerDay) + 1,
        slotIndexInDay: i % numberOfSotsPerDay + 1,
        globalSlotIndex: i
      };
      schedule.push(item);
    }

    const segments: Map<number, Slot[]> = new Map();
    for (let i = 0; i < count; i++) {
      segments.set(i, [])
    }

    // split schedule in "count" pices by segmentLength
    let currentSegment: number = 0;
    for (let i = 0; i < totalNumberOfSlots; i++) {
      const currentSegmentLength: number = segments.get(currentSegment)?.length || 0;
      const reachedSegmentLength: boolean = currentSegmentLength === segmentLength;
      const isNewDay: boolean = schedule[i].slotIndexInDay == 1;
      if ((reachedSegmentLength || isNewDay && (currentSegmentLength + numberOfSotsPerDay > segmentLength))
      && currentSegment < count - 1) {
        currentSegment++;
      }
      const segment: Slot[] | undefined = segments.get(currentSegment);
      segment?.push(schedule[i]);
    }

    segments.forEach((value: Slot[], key, map) => {
      console.log('===============NEW SEGMENT===========');
      for (let item of value) {
         console.log ('              ***' + item.dayOfWeek + '    ' + item.globalSlotIndex);

         const roomId: number | null = this.findFreeRoomForDaySlot(item.dayOfWeek, item.slotIndexInDay, slots);
         const userId: number | null = this.findFreeUserForDaySlotAndSubject(item.dayOfWeek, item.slotIndexInDay, slots, subjectId);
         const groupIsFree: boolean = this.checkGroupIsFreeForDaySlot(item.dayOfWeek, item.slotIndexInDay, slots, groupId);

         if (groupIsFree && roomId && userId) {
           // все вльне, можна призначати пару на цей слот
           this.scheduleSlotService.create({
             dayOfWeek: item.dayOfWeek,
             slotNumber: item.slotIndexInDay, // 1, 2, 3, 4 , 5 це номер пари в сегменті (тобто в дні)
             groupId: groupId,
             subjectId: subjectId,
             roomId: roomId,
             userId: userId
           });

           // призначили пару на відрізок, перейти на наступний відрізок
           break;
         }

      }
    });
  }

  scheduleGroupSubject1(groupId: string, subjectId: string, count: number): void {
    // видалити заплановані слоти для групи / дисципліни
    this.scheduleSlotService.deleteByGroupAndSubject(groupId, subjectId);

    // кожен день має по 6 слотів (кожен слот це 1 пара)
    const totalDays: number = 5; // monday - friday
    const numberOfSotsPerDay: number = 6;
    const totalNumberOfSlots: number = totalDays * numberOfSotsPerDay;
    // якщо адін вказав зробити пару 2 рази на тиждень, то в нас виходить 2 відрізки по 15 пар, і на кожен з цих відрізків треба призначити пару
    const segmentLength: number = Math.floor(totalNumberOfSlots / count); // забрати дріб

    // all currently saved slots
    const slots = this.scheduleSlotService.getAll();

    for (let currentSlot = 0; currentSlot < totalNumberOfSlots; currentSlot++) {
      console.log(`Slot ${currentSlot + 1}:`);

      // Perform operations for each slot
      const segmentStart = currentSlot;
      const segmentEnd = Math.min(currentSlot + segmentLength - 1, totalNumberOfSlots - 1);
      const dayOfWeek = Math.floor(currentSlot / numberOfSotsPerDay) + 1; // Monday = 1, Tuesday = 2, ..., Friday = 5
      // Calculate daySlotNumber within the day of the week (1 based)
      const daySlotNumber = currentSlot % numberOfSotsPerDay + 1;

      console.log(`Segment: ${segmentStart} - ${segmentEnd}`);
      // You can perform operations for each slot here

      const roomId: number | null = this.findFreeRoomForDaySlot(dayOfWeek, daySlotNumber, slots);
      const userId: number | null = this.findFreeUserForDaySlotAndSubject(dayOfWeek, daySlotNumber, slots, subjectId);
      const groupIsFree: boolean = this.checkGroupIsFreeForDaySlot(dayOfWeek, daySlotNumber, slots, groupId);

      if (groupIsFree && roomId && userId) {
        // found free slot to schedule group / subject / room
        this.scheduleSlotService.create({
          dayOfWeek: dayOfWeek,
          slotNumber: daySlotNumber, // 1, 2, 3, 4 , 5 це номер пари в сегменті (тобто в дні)
          groupId: groupId,
          subjectId: subjectId,
          roomId: roomId,
          userId: userId
        });

        // only one slot should be scheduled per segment, so switch to next segment
        currentSlot = segmentEnd + 1 - ((segmentEnd + 1) % numberOfSotsPerDay);
      }
    }
  }

  findFreeRoomForDaySlot(dayOfWeek: number, daySlotNumber: number, slots: ScheduleSlot[]): number | null {
    const rooms = this.roomService.getAll();
    for (const room of rooms) {
      let roomBusyForDaySlot: boolean = false;
      for (const slot of slots) {
        if (slot.dayOfWeek == dayOfWeek && slot.slotNumber == daySlotNumber && slot.roomId == room.id) {
          // this room is busy for the slot, so must check another room; break slots loop
          roomBusyForDaySlot = true;
          break;
        }
      }

      // found not busy room for this slot in day
      if (!roomBusyForDaySlot) {
        return room.id;
      }
    }

    // all rooms busy
    return null;
  }

  findFreeUserForDaySlotAndSubject(dayOfWeek: number, daySlotNumber: number, slots: ScheduleSlot[], subjectId: string): number | null {
    // find teachers who can teach the subject
    const users = this.userService.getAll().filter(u => u.subjectIds && u.subjectIds.indexOf(subjectId) > -1);

    for (const user of users) {
      let userBusyForDaySlot: boolean = false;
      for (const slot of slots) {
        if (slot.dayOfWeek == dayOfWeek && slot.slotNumber == daySlotNumber && slot.userId == user.id) {
          // this user is busy for the slot, so must check another user; break slots loop
          userBusyForDaySlot = true;
          break;
        }
      }

      // found not busy user for this slot in day
      if (!userBusyForDaySlot) {
        return user.id;
      }
    }

    // all rooms busy
    return null;
  }

  checkGroupIsFreeForDaySlot(dayOfWeek: number, daySlotNumber: number, slots: ScheduleSlot[], groupId: string): boolean {
    for (const slot of slots) {
      if (slot.dayOfWeek == dayOfWeek && slot.slotNumber == daySlotNumber && slot.groupId == groupId) {
        // this group is busy for the slot
        return false;
      }
    }

    // group is free for the slot
    return true;
  }
}
