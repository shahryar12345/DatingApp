import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent> {

    canDeactivate(component: MemberEditComponent)
    {
        //console.log('   : ' + component.editForm.dirty);
        if (component.editForm.dirty) {
            //console.log('   : ' + component.editForm.dirty);
            return confirm('Are You sure you want to continue? Any unsaved changes will be lost.');
        }
        return true;
    }
}