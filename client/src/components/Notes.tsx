import { useEffect, useRef, useState } from "react";
import { Loader, Plus, Trash } from "react-feather";
import useSWRMutation from "swr/mutation";
import {
  getNotes,
  createNote,
  deleteNote,
  updateNote,
  useOnClickOutside,
} from "../lib/utils";
import { create } from "zustand";

type NoteType = {
  content: string;
  date: string;
  id: number;
  title: string;
  username: string;
  updated: string;
};

interface NoteStore {
  notes: NoteType[];
  currentIndex: number;
  updateTitle: (title: string) => void;
  updateContent: (content: string) => void;
  updateIndex: (index: number) => void;
  updateNotes: (notes: NoteType[]) => void;
  getTitle: () => string;
  getContent: () => string;
}

const useNoteStore = create<NoteStore>()((set, get) => ({
  notes: [] as NoteType[],
  currentIndex: 0,
  updateTitle: (title: string) =>
    set((state) => {
      let notes = state.notes;
      notes[get().currentIndex].title = title;
      return { notes };
    }),
  updateContent: (content: string) =>
    set((state) => {
      let notes = state.notes;
      notes[get().currentIndex].content = content;
      return { notes };
    }),
  updateIndex: (index: number) => set((state) => ({ currentIndex: index })),
  updateNotes: (notes: NoteType[]) => set((state) => ({ notes })),
  getTitle: () => get().notes[get().currentIndex]?.title ?? "",
  getContent: () => get().notes[get().currentIndex]?.content ?? "",
}));

export default function Notes() {
  const {
    notes,
    currentIndex,
    updateContent,
    updateTitle,
    updateIndex,
    updateNotes,
    getTitle,
    getContent,
  } = useNoteStore((state) => state);
  const ref = useRef(null);

  const { trigger: triggerGetNotes, isMutating: isMutatingGetNotes } =
    useSWRMutation("/getnotes", async (url: string) => {
      return await getNotes(url).then((res) => {
        updateNotes(res.notes);
        return res;
      });
    });

  const { trigger: triggerCreateNote, isMutating: isMutatingCreateNote } =
    useSWRMutation("/createnote", async (url: string) => {
      return await createNote(url).then((res) => {
        triggerGetNotes();
        return res;
      });
    });

  const { trigger: triggerDeleteNote, isMutating: isMutatingDeleteNote } =
    useSWRMutation(
      "/deletenote",
      async (url: string, { arg: { id } }: { arg: { id: number } }) => {
        return await deleteNote(url, { arg: { id } }).then((res) => {
          triggerGetNotes();
          return res;
        });
      }
    );

  const { trigger: triggerUpdateNote, isMutating: isMutatingUpdateNote } =
    useSWRMutation(
      "/updatenote",
      async (
        url: string,
        {
          arg: { id, title, content },
        }: { arg: { id: number; title: string; content: string } }
      ) => {
        return await updateNote(url, {
          arg: { id, title, content },
        }).then((res) => {
          triggerGetNotes();
          return res;
        });
      }
    );

  useEffect(() => {
    triggerGetNotes();
    // const interval = setInterval(() => {
    //   console.log("interval");
    //   triggerUpdateNote({
    //     id: notes[currentIndex]?.id,
    //     title: getTitle(),
    //     content: getContent(),
    //   });
    // }, 10000);
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      updateContent(notes[currentIndex]?.content);
      updateTitle(notes[currentIndex]?.title);
    }
  }, [notes, currentIndex]);

  window.onbeforeunload = function () {
    triggerUpdateNote({
      id: notes[currentIndex].id,
      title: getTitle(),
      content: getContent(),
    });
    return "Would you really like to close your browser?";
  };

  useOnClickOutside(ref, () => {
    if (typeof currentIndex == "number" && notes.length > 0) {
      triggerUpdateNote({
        id: notes[currentIndex].id,
        title: getTitle(),
        content: getContent(),
      });
    }
  });

  return (
    <main className="flex flex-row min-h-screen w-full text-white bg-black">
      <div className="flex flex-col items-center w-[24rem] border-r-2 px-4 py-2 max-h-screen">
        <div className="flex flex-row items-center w-full gap-2">
          <button
            onClick={() => {
              triggerCreateNote();
            }}
            className="text-white bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-600 hover:bg-gradient-to-br focus:outline-none shadow-md shadow-purple-800/80 font-semibold rounded text-base p-1 text-center"
          >
            {isMutatingCreateNote ? <Loader /> : <Plus />}
          </button>
          <input
            placeholder="Search"
            className="outline-none w-full placeholder:text-neutral-300 font-medium border-b-2 py-1"
          />
        </div>
        <div className="w-full overflow-auto">
          {notes.map((note, i) => {
            return (
              <div
                key={note.id}
                onClick={() => {
                  updateIndex(i);
                }}
                className="cursor-pointer"
              >
                <div className="border-b-2 p-2 my-1 h-20 flex flex-col justify-center">
                  <p>{note.id}</p>
                  <p className="font-semibold truncate">{note.title}</p>
                  <p className="truncate">{note.content}</p>
                  {/* {isMutatingUpdateNote && currentIndex == note.id ? (
                    <Loader />
                  ) : null} */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col flex-grow" ref={ref}>
        <div className="flex flex-row items-center gap-2 px-4 py-2">
          <input
            placeholder="Title"
            className="w-full px-2 py-1 bg-black focus:outline-none font-semibold"
            id="title"
            value={getTitle()}
            onChange={(e) => {
              updateTitle(e.target.value);
            }}
          />
          <button
            onClick={() => {
              triggerDeleteNote({ id: notes[currentIndex]?.id });
            }}
          >
            {isMutatingDeleteNote ? <Loader /> : <Trash />}
          </button>
        </div>
        <textarea
          autoFocus={true}
          id="textarea"
          value={getContent()}
          disabled={isMutatingGetNotes}
          onChange={(e) => {
            updateContent(e.target.value);
          }}
          className="w-full h-full bg-black px-10 focus:outline-none py-2 resize-none desktop:text-base"
        ></textarea>
      </div>
    </main>
  );
}
