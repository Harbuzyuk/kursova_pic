import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { ScheduleSlot } from '../models/schedule-slot.model';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduleSlotService {
  TABLE = 'scheduleSlot';

  constructor(private http: HttpClient,
    private dbService: DbService) {
  }

  deleteByGroupAndSubject(groupId: string, subjectId: string): void {
    let scheduleSlots: ScheduleSlot[] = this.dbService.getTableData(this.TABLE).filter((s: ScheduleSlot) => s.groupId != groupId || s.subjectId != subjectId);
    this.dbService.updateTableData(this.TABLE, scheduleSlots);
  }

  getAll(): ScheduleSlot[] {
    return this.dbService.getAll(this.TABLE);
  }

  get(id: any): Observable<ScheduleSlot> {
    return this.dbService.get(this.TABLE, id);
  }

  create(data: any): Observable<any> {
    return this.dbService.save(this.TABLE, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.dbService.save(this.TABLE, data);
  }

  delete(id: any): Observable<any> {
    return this.dbService.delete(this.TABLE, id);
  }
/*
  findByTitle(searchString: string): Observable<ScheduleSlot[]> {
    return this.dbService.getAll(this.TABLE).pipe(
      map(allData => allData.filter(
        (item: ScheduleSlot) => this.containsString(searchString, item.name)))
    );
  }

  private containsString(search: string, searchIn?: string): boolean {
    // if search filter is empty then all records are ok
    if (search == '') return true;
    if (searchIn === undefined || searchIn === null) return false;
    const searchUpper: string = search.toUpperCase();
    const searchInUpper: string = searchIn.toUpperCase();
    return searchInUpper.indexOf(searchUpper) > -1;
  }
  */
}
