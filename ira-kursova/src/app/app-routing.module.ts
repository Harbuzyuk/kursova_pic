import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { GroupListComponent } from './components/group-list/group-list.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { SubjectListComponent } from './components/subject-list/subject-list.component';
import { GroupDetailsComponent } from './components/group-details/group-details.component';
import { RoomDetailsComponent } from './components/room-details/room-details.component';
import { SubjectDetailsComponent } from './components/subject-details/subject-details.component';
import { ScheduleComponent } from './components/schedule/schedule.component';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuardService] },
  { path: 'groups', component: GroupListComponent, canActivate: [AuthGuardService] },
  { path: 'rooms', component: RoomListComponent, canActivate: [AuthGuardService] },
  { path: 'subjects', component: SubjectListComponent, canActivate: [AuthGuardService] },

  { path: 'user', component: UserDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'group', component: GroupDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'room', component: RoomDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'subject', component: SubjectDetailsComponent, canActivate: [AuthGuardService] },

  { path: 'user/:id', component: UserDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'group/:id', component: GroupDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'room/:id', component: RoomDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'subject/:id', component: SubjectDetailsComponent, canActivate: [AuthGuardService] },

  { path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuardService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
