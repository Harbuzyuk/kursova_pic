import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { User } from '../models/user.model';
import { DbService } from './db.service';
import { MD5 } from 'md5-js-tools';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: User | null = null;

  TABLE = 'people';
  ADMIN_ID = 9999999;

  constructor(private http: HttpClient,
    private dbService: DbService) {

    // create admin user if doesn't exist
    this.dbService.get(this.TABLE, this.ADMIN_ID).subscribe({
      next: (res) => {
        // doesn't exist?
        if (res === undefined) {
          this.dbService.save(this.TABLE, <User>{
            id: this.ADMIN_ID,
            firstName: 'Admin',
            middleName: '',
            lastName: '',
            email: 'admin@lpnu.edu',
            password: MD5.generate('admin')
          })
        }
      },
      error: (e) => console.error(e)
    });
  }

  getAll(): User[] {
    return this.dbService.getAll(this.TABLE);
  }

  get(id: any): Observable<User> {
    return this.dbService.get(this.TABLE, id);
  }

  getByEmail(email: string): Observable<User> {
    return this.dbService.getByPropertyValue(this.TABLE, 'email', email);
  }

  create(data: any): Observable<any> {
    return this.dbService.save(this.TABLE, data);
  }

  update(id: any, data: any): Observable<any> {
    if (!data.id) {
      // new user, create password
      data.password = MD5.generate(data.email);
    }
    return this.dbService.save(this.TABLE, data);
  }

  delete(id: any): Observable<any> {
    return this.dbService.delete(this.TABLE, id);
  }

  findByTitle(searchString: string): User[] {
    return this.dbService.getAll(this.TABLE).filter(
        (item: User) => this.containsString(searchString, item.firstName) || this.containsString(searchString, item.lastName)
    );
  }

  getSessionUser(): User | null {
    return this.user;
  }

  setSessionUser(u: User | null): void {
    this.user = u;
    this.dbService.setSessionUser(u == null ? null : u.id.toString());
  }

  isCurrentUserAdmin(): boolean {
    return this.getSessionUser()?.id === this.ADMIN_ID;
  }

  isUserAdmin(id: number): boolean {
    return id == this.ADMIN_ID;
  }

  login(email: string, password: string): Observable<boolean> {
    return new Observable((subscriber) => {
      this.getByEmail(email)
      .subscribe({
        next: (res) => {
          // found user? check password
          if (res === undefined || res.password !== MD5.generate(password)) {
            subscriber.next(false);
          }
          else {
            // login successfull
            this.setSessionUser(res);
            subscriber.next(true);
          }
        },
        error: (e) => console.error(e)
      });
    });
  }

  logout(): void {
    this.setSessionUser(null);
    this.dbService.removeSessionUser();
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
