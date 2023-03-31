import { useEffect, useState } from "react";
import { Loader, LogOut, Menu, Plus, Search, Trash } from "react-feather";
import useSWRMutation from "swr/mutation";
import { getNotes, createNote, deleteNote, updateNote } from "../lib/utils";
import { create } from "zustand";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

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
  const navigate = useNavigate();
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

  const [search, setSearch] = useState<string>("");
  const [isMobileMenuClicked, setIsMobileMenuClicked] =
    useState<boolean>(false);

  const { trigger: triggerGetNotes, isMutating: isMutatingGetNotes } =
    useSWRMutation("/getnotes", async (url: string) => {
      return await getNotes(url).then((res) => {
        updateNotes(res.notes);
        updateIndex(0);
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
        return await deleteNote(url, { arg: { id } })
          .then((res) => {
            triggerGetNotes();
            return res;
          })
          .then((res) => {
            updateIndex(0);
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
          return res;
        });
      }
    );

  useEffect(() => {
    triggerGetNotes();
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
    return "";
  };

  return (
    <main className="flex flex-row min-h-screen w-full text-white bg-neutral-950">
      <div
        className={
          "desktop:left-auto transition-all delay-300 desktop:flex desktop:relative fixed bottom-0 top-0 bg-neutral-950 overflow-auto flex-col items-center desktop:w-96 md:w-80 w-full max-h-screen " +
          (isMobileMenuClicked ? "left-0" : "left-[-100%]")
        }
      >
        <div className="flex flex-row items-center w-full px-2">
          <Search />
          <input
            placeholder="Search"
            className="px-1 outline-none w-full placeholder:text-neutral-300 font-medium py-2 bg-neutral-950 placeholder:font-semibold"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="w-full overflow-auto mt-0">
          {notes.map((note, i) => {
            if (!note.title.toLowerCase().includes(search.toLowerCase())) {
              return;
            }
            return (
              <div key={note.id} className="px-2 py-1 mb-1">
                <div className="flex flex-row items-center gap-2">
                  <p className="text-sm text-neutral-400 italic">
                    Last updated:{" "}
                    {format(new Date(note.updated), " dd/MM/yyyy")}
                  </p>
                  <p>
                    {" "}
                    {isMutatingUpdateNote && currentIndex === i ? (
                      <Loader className="animate-spin h-3 w-3" />
                    ) : null}
                  </p>
                </div>
                <div
                  onClick={() => {
                    updateIndex(i);
                    setIsMobileMenuClicked(false);
                  }}
                  className={
                    "cursor-pointer px-2 h-20 flex flex-col justify-center rounded-md " +
                    (currentIndex === i ? "bg-neutral-800" : "bg-neutral-900")
                  }
                >
                  <p className="font-semibold truncate">{note.title}</p>
                  <p className="truncate">{note.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex flex-row items-center w-full justify-between desktop:px-4 px-2 py-2">
          <div className="flex flex-row items-center gap-2 ">
            <button
              className={
                "desktop:hidden visible text-white bg-neutral-800 hover:bg-neutral-700 transition-colors focus:outline-none font-semibold rounded text-base desktop:px-2 p-1 text-center " +
                (notes.length > 0 ? "" : "hidden")
              }
              onClick={() => {
                setIsMobileMenuClicked(!isMobileMenuClicked);

              }}
            >
              <Menu />
            </button>
            <button
              onClick={() => {
                triggerCreateNote();
              }}
              className="text-blue-500 bg-neutral-800 hover:bg-neutral-700 transition-colors focus:outline-none font-semibold rounded text-base desktop:px-2 p-1 text-center"
            >
              {isMutatingCreateNote ? (
                <Loader className="animate-spin" />
              ) : (
                <>
                  <Plus />
                </>
              )}
            </button>
            <button
              onClick={() => {
                triggerDeleteNote({ id: notes[currentIndex]?.id });
              }}
              className="bg-neutral-800 hover:bg-neutral-700 transition-colors text-red-500 focus:outline-none font-semibold rounded text-base desktop:px-2 p-1 text-center"
            >
              {isMutatingDeleteNote ? (
                <Loader className="animate-spin" />
              ) : (
                <>
                  <Trash />
                </>
              )}
            </button>
          </div>
          <button
            onClick={() => {
              document.cookie = "token=;";
              navigate(0);
            }}
            className="text-white bg-neutral-800 hover:bg-neutral-700 transition-colors focus:outline-none font-semibold rounded text-base desktop:px-2 p-1 text-center"
          >
            <LogOut />
          </button>
        </div>
        <div
          className="w-full bg-neutral-950 h-full flex flex-col justify-center items-center desktop:px-4 px-2 py-2"
          onBlur={() => {
            if (typeof currentIndex == "number" && notes.length > 0) {
              triggerUpdateNote({
                id: notes[currentIndex].id,
                title: getTitle(),
                content: getContent(),
              });
            }
          }}
        >
          {isMutatingGetNotes ? (
            <Loader className="animate-spin" />
          ) : (
            <>
              {notes.length > 0 ? (
                <>
                  <div className="w-full flex flex-row items-center">
                    <input
                      autoFocus={true}
                      spellCheck={false}
                      className="flex-grow flex desktop:text-2xl px-4 py-2 rounded bg-neutral-900 focus:outline-none font-semibold"
                      id="title"
                      value={getTitle()}
                      onChange={(e) => {
                        updateTitle(e.target.value);
                      }}
                    />
                  </div>
                  <textarea
                    id="textarea"
                    value={getContent()}
                    disabled={isMutatingGetNotes}
                    spellCheck={false}
                    onChange={(e) => {
                      updateContent(e.target.value);
                    }}
                    className="w-full h-full bg-neutral-900 p-4 mt-4 rounded focus:outline-none resize-none desktop:text-base"
                  ></textarea>
                </>
              ) : (
                <div className="w-full bg-neutral-950 h-full flex flex-col justify-center items-center">
                  <button
                    onClick={() => {
                      triggerCreateNote();
                    }}
                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:bg-gradient-to-br focus:outline-none shadow-sm shadow-blue-800/80 font-semibold rounded text-xl p-2 text-center"
                  >
                    Create a new note
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
