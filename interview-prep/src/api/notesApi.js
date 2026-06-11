import { get, post, put, del } from "./api";

export const fetchNotes    = ()          => get("/notes");
export const createNote    = (note)      => post("/notes", note);
export const updateNote    = (id, note)  => put(`/notes/${id}`, note);
export const deleteNote    = (id)        => del(`/notes/${id}`);
