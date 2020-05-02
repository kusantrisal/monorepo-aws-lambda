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
    static readonly type = '[RESOURCE] AddResource';
    constructor(public payload: Object[]) { }
}

export class UpdateResource {
    static readonly type = '[RESOURCE] UpdateResource';
    constructor(public payload: Object) { }
}

export class DeleteResource {
    static readonly type = '[RESOURCE] DeleteResource';
    constructor(public payload: Object) { }
}

export class RefreshResource {
    static readonly type = '[RESOURCE] RefreshResource';
    constructor(public payload: Object[]) { }
}
