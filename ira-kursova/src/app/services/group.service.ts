import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Group } from '../models/group.model';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  TABLE = 'group';

  constructor(private http: HttpClient,
    private dbService: DbService) {
  }

  getAll(): Group[] {
    return this.dbService.getAll(this.TABLE);
  }

  get(id: any): Observable<Group> {
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

  findByTitle(searchString: string): Group[] {
    return this.dbService.getAll(this.TABLE).filter(
        (item: Group) => this.containsString(searchString, item.name)
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
}
