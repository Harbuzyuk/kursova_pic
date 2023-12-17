import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DbService {

  constructor(private http: HttpClient) {
  }

  save(tableName: string, data: any): Observable<void> {
    const tableData = this.getTableData(tableName);
    // new entity?
    if (data.id === null || data.id === undefined || data.id === '') {
      data.id = this.getNewId();
      tableData.push(data);
    } else {
      const index = tableData.findIndex(item => item.id == data.id);
      if (index > -1) {
        tableData[index] = { ...tableData[index], ...data };
      } else {
        tableData.push(data); // deleted somehow, recreate
      }
    }
    this.updateTableData(tableName, tableData);
    return of(undefined);
  }

  get(tableName: string, id: number): Observable<any> {
    const tableData = this.getTableData(tableName);
    const index = tableData.findIndex(item => item.id == id);
    return of(index > -1 ? tableData[index] : undefined);
  }

  getByPropertyValue(tableName: string, propName: string, value: string): Observable<any> {
    const tableData = this.getTableData(tableName);
    const index = tableData.findIndex(item => item[propName] == value);
    return of(index > -1 ? tableData[index] : undefined);
  }

  getAll(tableName: string): any[] {
    return this.getTableData(tableName);
  }

  delete(tableName: string, id: number): Observable<void> {
    const tableData = this.getTableData(tableName);
    const index = tableData.findIndex(item => item.id == id);
    if (index >= 0 && index < tableData.length) {
      tableData.splice(index, 1);
      this.updateTableData(tableName, tableData);
    }
    return of(undefined);
  }

  setSessionUser(user: string) {
    localStorage.setItem('authUser', user);
  }

  removeSessionUser() {
    localStorage.removeItem('authUser');
  }

  getSessionUser(): string | null {
    return localStorage.getItem('authUser');
  }

  private getNewId(): number {
    let lastIdNumber: number = 0;
    const lastIdString: string | null = localStorage.getItem('lastId');
    if (typeof(lastIdString) != 'number' && lastIdString != null) {
      lastIdNumber = Number.parseInt(lastIdString);
    }

    ++lastIdNumber;
    localStorage.setItem('lastId', lastIdNumber.toString());

    return lastIdNumber;
  }

  public getTableData(tableName: string): any[] {
    const storedData = localStorage.getItem(tableName);
    return storedData ? JSON.parse(storedData) : [];
  }

  public updateTableData(tableName: string, data: any[]): void {
    localStorage.setItem(tableName, JSON.stringify(data));
  }
}
