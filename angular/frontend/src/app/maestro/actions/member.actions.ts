import { Member } from '../model/member.model';

export class AddMember {
    static readonly type = '[MEMBER] Add';
    constructor(public payload: Member) { }
}

export class RemoveMember {
    static readonly type = '[MEMBER] Remove';
    constructor() { }
}

export class AddResource {
    static readonly type = '[MEMBER] AddResource';
    constructor(public payload: Object[]) { }
}