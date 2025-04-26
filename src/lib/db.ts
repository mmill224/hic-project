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

    constructor() {
        super('myAppDatabase');
        this.version(1).stores({
            notes: '++id, title, content, dueDate, createdDate', // primary key and indexed properties
            tags: '++id, name, color',
            noteTagRelation: '++id, tagId, noteId'
        });
        this.notes = this.table('notes');
        this.tags = this.table('tags');
        this.noteTagRelation = this.table('noteTagRelation');
    }
}

export const db = new MyAppDatabase();
