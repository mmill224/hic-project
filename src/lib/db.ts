// src/lib/db.ts
import Dexie from 'dexie';

// one task may have many tags
export interface Tag {
    id?: number;
    noteId: number; // fk to task
    name: string;
    color: string;
}

export interface Note {
    id?: number;
    title: string | undefined;
    content: string | undefined;
}

export class MyAppDatabase extends Dexie {
    notes: Dexie.Table<Note, number>;
    tags: Dexie.Table<Tag, number>;

    constructor() {
        super('myAppDatabase');
        this.version(1).stores({
            notes: '++id, title, content', // primary key and indexed properties
            tags: '++id, name, color, noteId'
        });
        this.notes = this.table('notes');
        this.tags = this.table('tags');
    }
}

export const db = new MyAppDatabase();
