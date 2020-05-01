import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Member } from './../model/member.model';
import { AddMember, RemoveMember, AddResource } from '../actions/member.actions';

export class MemberStateModel {
    username: string;
    member: Member;
    resources: Object[]
}

@State<MemberStateModel>({
    name: 'member',
    defaults: {
        username: 'defualt',
        member: { memberUuid: '', createDate: '', email: '', phone: '', firstName: '', lastName: '' },
        resources: []
    }
})

export class MemberState {
    constructor() { };

    @Selector()
    static getMember(state: MemberStateModel) {
        return state.member
    }

    @Action(AddMember)
    add({ getState, patchState }: StateContext<MemberStateModel>, { payload }: AddMember) {
        const state = getState();
        patchState({
            username: payload.firstName,
            member: payload
        })
    }

    @Action(RemoveMember)
    remove({ getState, patchState }: StateContext<MemberStateModel>, {  }: RemoveMember) {
        const state = getState();
        patchState({
            username: state.username,
            member: {memberUuid: ''}
        })
    }

    @Action(AddResource)
    addResource({ getState, patchState }: StateContext<MemberStateModel>, { payload }: AddResource) {
        const state = getState();
        patchState({
          resources:  payload
        })
    }
}