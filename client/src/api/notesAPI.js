import axios from "axios";
axios.defaults.withCredentials = true;
import { BASE_URL } from "./apiConfig";

export const getUserNotes = async () => {
  const response = await axios.get(`${BASE_URL}/api/v1/notes`, {
    headers: {
      "Access-Control-Allow-Credentials": true,
    },
    credentials: "include",
  });
  return response.data?.notes;
};

export const getNoteById = async (noteId) => {
  const response = await axios.get(`${BASE_URL}/api/v1/notes/${noteId}`);
  return response.data?.note;
};

export const updateNote = async (note) => {
  const response = await axios.patch(`${BASE_URL}/api/v1/notes/`, { note });
  return response.data?.note;
};

export const createNote = async (title) => {
  const response = await axios.post(`${BASE_URL}/api/v1/notes`, { title });
  return response.data?.note;
};

export const deleteNote = async (noteId) => {
  const response = await axios.delete(`${BASE_URL}/api/v1/notes?id=${noteId}`);
  return response.data?.note;
};


