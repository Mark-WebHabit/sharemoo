import React, { useState, useRef, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";
import FormButton from "./FormButton";
import storage from "../firebase/config.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";

import { addPost } from "../features/postsSlice.js";

const PostModal = ({ handleAddPost }) => {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef();
  const hiddenRef = useRef();

  const { id } = useSelector((state) => state.user.loggedInUser);

  const dispatch = useDispatch();
  useEffect(() => {
    // Function to adjust the height
    const adjustHeight = () => {
      if (textareaRef && textareaRef.current) {
        textareaRef.current.style.height = "auto"; // Reset the height
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
      }
    };

    // Adjust height on text change
    adjustHeight();
  }, [text]); // Depend on `text` to adjust height when it changes

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    let imageUrl; // Declare imageUrl variable to store the download URL
    if (selectedFile) {
      const storageRef = ref(storage, `images/${selectedFile.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error(error.message);
        setLoading(false);
        // Handle the error appropriately, e.g., by showing an error message to the user
        return; // Exit the function if there was an error during file upload
      }
    }

    if (text === "" && !imageUrl) {
      // Replace alert with a user-friendly notification
      alert("Please Provide at least Text or Photo");
      setLoading(false);
      return;
    }

    // Use the local `imageUrl` variable instead of `photo` state
    dispatch(
      addPost({
        id, // Make sure 'id' is defined somewhere
        text_content: text,
        photo_content: imageUrl, // Use imageUrl here
      })
    );
    setLoading(false);
    handleClose(e); // Make sure handleClose is defined and handles closing the modal or resetting the form
  };

  const handleClose = (e) => {
    handleAddPost(e);
    setText("");
    setSelectedFile(null);
    setPreviewImage(null);
  };

  return (
    <Container>
      <div className="modal">
        <img
          src="/media/close.png"
          alt=""
          className="close-icon"
          onClick={handleClose}
        />
        <h1>CREATE POST</h1>
        <form
          action="
          "
        >
          <textarea
            ref={textareaRef}
            name="text_content"
            id="text_content"
            placeholder="What's on your mind?"
            value={text}
            onChange={handleChange}
            maxLength={500}
          ></textarea>
          {previewImage && selectedFile && (
            <img src={previewImage} alt="" className="img-container" />
          )}
          <input
            type="file"
            name="photo_content"
            className="hidden-input"
            ref={hiddenRef}
            onChange={handleFileChange}
            accept=".jpg, .jpeg"
          />
          <div className="trigger">
            <img
              src="/media/image.png"
              alt=""
              onClick={() => hiddenRef.current.click()}
            />
          </div>
          <div className="btn">
            {loading ? (
              <PulseLoader color={"#ffffff"} loading={loading} />
            ) : (
              <FormButton text={"POST"} padding={0.4} event={handleSubmit} />
            )}
          </div>
        </form>
      </div>
    </Container>
  );
};

export default PostModal;
const Container = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2;
  display: grid;
  place-items: center;
  backdrop-filter: blur(3px);

  & .modal {
    min-width: 500px;
    max-width: 30%;
    background: var(--darkbody);
    padding: 3em;
    border-radius: 0.6em;
    position: relative;

    & .close-icon {
      position: absolute;
      top: 0.5em;
      right: 0.5em;
      width: 20px;
      cursor: pointer;
    }

    & h1 {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 0.5em;
    }

    & form {
      wdith: 100%;

      & textarea {
        width: 100%;
        background: var(--gray);
        resize: none;
        height: auto;
        border: none;
        padding: 1em;
        border-radius: 0.5em;
        overflow-y: hidden;
        font-size: 0.8rem;

        &:focus {
          outline: none;
        }
      }

      & .hidden-input {
        display: none;
      }
      & .trigger {
        text-align: right;
      }
      & .trigger img {
        cursor: pointer;
        width: 50px;
      }

      & .img-container {
        width: 100%;
        max-width: 100%;
        margin: 0.3em 0;
      }

      & .btn {
        text-align: center;
      }
    }
  }
`;
