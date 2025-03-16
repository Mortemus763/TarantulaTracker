import { useState } from "react";
import { useDispatch } from "react-redux";
import { editForum, fetchForums } from "../../redux/forum";
import { useModal } from "../../context/Modal";
import "./EditForumPostForm.css";

function EditForumPostForm({ forum }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [title, setTitle] = useState(forum.title);
  const [content, setContent] = useState(forum.content);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const updatedForum = { title, content };

    try {
      await dispatch(editForum({ forumId: forum.id, forumData: updatedForum }));
      dispatch(fetchForums());
      closeModal();
    } catch (err) {
      setErrors(["Failed to update forum post"]);
    }
  };

  return (
    <div className="forum-edit-form-container">
      <h2>Edit Forum Post</h2>
      <form onSubmit={handleSubmit}>
        {errors.length > 0 && <p className="error">{errors[0]}</p>}

        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button type="submit">Update Forum</button>
      </form>
    </div>
  );
}

export default EditForumPostForm;
