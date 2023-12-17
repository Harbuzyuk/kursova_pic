import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { SubjectListComponent } from './components/subject-list/subject-list.component';
import { RoomDetailsComponent } from './components/room-details/room-details.component';
import { GroupDetailsComponent } from './components/group-details/group-details.component';
import { SubjectDetailsComponent } from './components/subject-details/subject-details.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserDetailsComponent,
    GroupListComponent,
    GroupDetailsComponent,
    RoomListComponent,
    RoomDetailsComponent,
    SubjectListComponent,
    SubjectDetailsComponent,
    ScheduleComponent,
    LoginComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
