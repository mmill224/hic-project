// src/lib/db.ts
import Dexie from 'dexie';

// one task may have many tags
export interface Tag {
    id?: number;
    name: string;
    color: string;
}

export interface Note {
    id?: number;
    title?: string;
    content?: string;
    dueDate?: Date;
    createdDate?: Date;
}

export interface RestorableNote {
    dateDeleted: Date;
    note: Note;
    id?: number;
}

export interface noteTagRelation {
    id?: number;
    tagId?: number; // fk to tag
    noteId?: number; // fk to task
}
export function getTags() {
    return db.tags.toArray();
}

export class MyAppDatabase extends Dexie {
    notes: Dexie.Table<Note, number>;
    tags: Dexie.Table<Tag, number>;
    noteTagRelation: Dexie.Table<noteTagRelation, number>;
    restorableNotes: Dexie.Table<RestorableNote, number>;

    constructor() {
        super('myAppDatabase');
        this.version(2).stores({
            notes: '++id, title, content, dueDate, createdDate', // primary key and indexed properties
            tags: '++id, name, color',
            noteTagRelation: '++id, tagId, noteId',
            restorableNotes: '++id, dateDeleted'
        }).upgrade(() => { });
        this.notes = this.table('notes');
        this.tags = this.table('tags');
        this.noteTagRelation = this.table('noteTagRelation');
        this.restorableNotes = this.table('restorableNotes');
    }
}

export const db = new MyAppDatabase();
