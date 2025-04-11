import Dexie from "dexie";
import { db } from "$lib/db";
import type { Note, Tag, noteTagRelation} from "$lib/db";

export async function addOrUpdateNote(note: Note, tags: Tag[] = []): Promise<boolean> {
    try {
        if (note.id) {
            await db.notes.update(note.id, note);
            await db.tags.bulkAdd(tags);
        } else {
            await db.notes.add(note);
            await db.tags.bulkAdd(tags);
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function deleteNote(note: Note | undefined): Promise<boolean> {
    try {
        await db.notes.delete(note?.id ?? -1)
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function deleteNoteById(noteId: number): Promise<boolean> {
    try {
        await db.notes.delete(noteId ?? -1)
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function addTagToDb(tag: Tag): Promise<boolean> {
    try {
        await db.tags.add(tag)
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function getTagsForNote(noteId: number): Promise<Tag[]> {
    try {
        const noteTags = await db.noteTagRelation.where("noteId").equals(noteId).toArray();
        const tagIds = noteTags.map((rel) => rel.tagId).filter((id): id is number => id !== undefined);
        return await db.tags.where("id").anyOf(tagIds).toArray();
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function getNotes(): Promise<Note[]> {
    try {
        return await db.notes.toArray();
    } catch (error) {
        console.log(error);
        return [];
    }
}