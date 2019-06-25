import {Routes} from '@angular/router'
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListComponent } from './list/list.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail-resolver';
import { MemberListResolver } from './_resolvers/member-list-resolver.1';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit-resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes-guard';
import { ListResolver } from './_resolvers/lists-resolvers';

export const appRoutes: Routes = [
    { path: '' , component: HomeComponent},
    { path: '' ,
      runGuardsAndResolvers: 'always' ,
      canActivate: [AuthGuard] ,
      children: [

        {path: 'members' , component: MemberListComponent ,
            resolve: {users: MemberListResolver}},
        {path: 'members/:id' , component: MemberDetailComponent ,
            resolve: {user: MemberDetailResolver} },
        {path: 'member/edit' , component: MemberEditComponent ,
            resolve: {user: MemberEditResolver} , canDeactivate: [PreventUnsavedChanges] },
        {path: 'messages' , component: MessagesComponent},
        {path: 'list' , component: ListComponent , resolve: {users: ListResolver}} //'users' this word is user in HTML page for retriving data from resolver
    ]
    },
    { path: '**' , redirectTo: '' , pathMatch: 'full'}, // any route other than the define one above with redirect to Home
    // odering in here is imp.
];

