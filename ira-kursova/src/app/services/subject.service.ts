import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Subject } from '../models/subject.model';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  TABLE = 'subject';

  constructor(private http: HttpClient,
    private dbService: DbService) {
  }

  getAll(): Subject[] {
    return this.dbService.getAll(this.TABLE);
  }

  get(id: any): Observable<Subject> {
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

  findByTitle(searchString: string): Subject[] {
    return this.dbService.getAll(this.TABLE).filter(
        (item: Subject) => this.containsString(searchString, item.name)
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
