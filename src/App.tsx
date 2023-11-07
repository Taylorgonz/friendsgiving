import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API } from "aws-amplify";
import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextField,
  View,
} from "@aws-amplify/ui-react";
import Delete from "./images/trash-can.png";
import Edit from "./images/pencil.png";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
  updateNote as updateNoteMutation
} from "./graphql/mutations";

interface INote {
  id: number,
  name: string,
  description: string
}
const App = () => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [edit, setEdit] = useState<INote | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData: any = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    setNotes(notesFromAPI);
  }

  async function createNote(event: any) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      name: form.get("name"),
      description: form.get("description"),
    };
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }

  async function deleteNote(id: number) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }
  async function updateNote(event: any) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      id: edit?.id,
      description: form.get("update-description"),
    };
    await API.graphql({
      query: updateNoteMutation,
      variables: { input: data },
    });
    await fetchNotes();
    await setEdit(null);
    event.target.reset();
  }

  return (
    <View margin="0 0 10rem 0" className="App">
      <View
        className="hero"
        width="100%"
      >
        <Heading
          level={1}
          color="white"
        >
          GONZ-GIVING
        </Heading>
      </View>
      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Your Name"
            label="Name"
            labelHidden
            variation="quiet"
            required
            width="30%"
          />
          <TextField
            name="description"
            placeholder="What're you bringing?"
            label="Note Description"
            labelHidden
            variation="quiet"
            width="60%"
            required
          />
        </Flex>
        <Button variation="primary" colorTheme="warning" marginTop="1em" type="submit">
          Submit
        </Button>
      </View>
      <Heading level={3}>CHECK THE LIST BEFORE YOU SUBMIT!</Heading>

      <View
        margin="2rem 0"
        className="submission-view"
      >
        {notes.map((note) => (
          <Flex
            key={note.id || note.name}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="submissions"
          >
            <Text padding=".5rem" className="name" width="30%" as="strong" fontWeight={700}>
              {note.name}
            </Text>
            {edit?.id === note.id ?
              <View padding="2px 0" width="80%" as="form" onSubmit={updateNote}>
                <Flex
                  direction="row"
                  justifyContent="start"
                  alignItems="center">
                  <TextField
                    name="update-description"
                    label="Note Description"
                    labelHidden
                    defaultValue={note.description}
                    variation="quiet"
                    width="100%"
                    textAlign="left"
                    required
                  />
                  <Button marginRight=".5rem" size="small" type="submit" variation="primary" colorTheme="overlay">
                    edit
                  </Button>
                </Flex>

              </View>
              : <>
                <Text width="60%" textAlign="left" as="span">{note.description}</Text>

                <Button padding="1px" type="submit" variation="link" onClick={() => {
                  setEdit(note)
                }}>
                  <Image width="24px" src={Edit} alt="trash can icon" />
                </Button>
                <Button marginRight=".5rem" padding="1px" variation="link" onClick={() => deleteNote(note.id)}>
                  <Image width="24px" src={Delete} alt="trash can icon" />
                </Button>
              </>}
          </Flex>
        ))}
      </View>
    </View>
  );
};

export default App;