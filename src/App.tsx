import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API } from "aws-amplify";
import {
  Button,
  CheckboxField,
  Fieldset,
  Flex,
  Heading,
  Image,
  Loader,
  Radio,
  RadioGroupField,
  Text,
  TextField,
  View,
  useTheme,
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
  type: string
}
const App = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [notes, setNotes] = useState<INote[]>([]);
  const [addNote, setAddNote] = useState<boolean>(false);
  const [edit, setEdit] = useState<INote | null>(null);

  const { tokens } = useTheme();
  
  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData: any = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    setNotes(notesFromAPI);
    setLoading(false);
  }

  async function createNote(event: any) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      type: form.get("type")
    };
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
    setAddNote(false);
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
      {addNote &&
        <View className="noteModal">
          <View position="relative" className="modalBody" as="form" margin="3rem 0" onSubmit={createNote}>
            <Text position="absolute" right="0" top="0" margin="1rem" fontSize="large" fontWeight="700" onClick={() => setAddNote(false)}>
              X
            </Text>
            <Flex height="100%" direction="column" justifyContent="space-between">
              <Heading className="modalHeader" level={3}>
                What're you bringing?
              </Heading>

              <TextField
                name="name"
                placeholder="Your Name"
                label="Name"
                labelHidden
                variation="quiet"
                required
                width="100%"
              />
              <TextField
                name="description"
                placeholder="What're you bringing?"
                label="Note Description"
                labelHidden
                variation="quiet"
                width="100%"
                required
              />
              <RadioGroupField
                label="Which one?"
                name="type"
                direction="row"
                alignItems="center"
              >
                <Radio value="dish">Dish</Radio>
                <Radio value="desert">Desert</Radio>
                <Radio value="drink">Drink</Radio>
              </RadioGroupField>

              <Button variation="primary" colorTheme="warning" marginTop="1em" type="submit">
                Submit
              </Button>
            </Flex>

          </View>
        </View>
      }
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

      <Heading marginTop="1rem" level={4}>WHAT'RE YOU BRINGING?</Heading>
      <Button display="block" variation="primary" colorTheme="warning" margin="1rem auto" onClick={() => setAddNote(true)}>
        Add +
      </Button>
      {loading ? <Loader filledColor={tokens.colors.orange[60]} width="80%"  variation="linear" /> :
        <View width="90%" marginInline="auto">

          <Heading className="submission-view" textAlign="left" level={2}>
            Dish
          </Heading>

          <View
            margin="2rem 0"
            className="submission-view"
          >
            {notes.filter((note) => note.type === "dish").map((note) => (
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
          <Heading className="submission-view" textAlign="left" level={2}>
            Desert
          </Heading>

          <View
            margin="2rem 0"
            className="submission-view"
          >
            {notes.filter((note) => note.type === "desert").map((note) => (
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
          <Heading textAlign="left" level={2}>
            Drink
          </Heading>

          <View
            margin="2rem 0"
            className={notes.find((note) => note.type === "drink") ? "submission-view" : ""}
          >
            {notes.filter((note) => note.type === "drink").map((note) => (
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
      }
    </View>
  );
};

export default App;