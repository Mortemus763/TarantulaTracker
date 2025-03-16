import { useState } from "react";
import { useDispatch } from "react-redux";
import { createForum, fetchForums } from "../../redux/forum";
import { useModal } from "../../context/Modal";
import "./ForumPostForm.css";

function ForumPostForm() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const newPost = { title, content };

    try {
      await dispatch(createForum(newPost));
      dispatch(fetchForums());
      closeModal();
    } catch (err) {
      setErrors(["Failed to create forum post"]);
    }
  };

  return (
    <div className="forum-form-container">
      <h2>Create Forum</h2>
      <form onSubmit={handleSubmit}>
        {errors.length > 0 && <p className="error">{errors[0]}</p>}

        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Small description</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button type="submit">Complete Forum</button>
      </form>
    </div>
  );
}

export default ForumPostForm;
