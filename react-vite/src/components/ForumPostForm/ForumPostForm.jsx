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
  const [tagInput, setTagInput] = useState(""); 
  const [tags, setTags] = useState([]); 
  const [errors, setErrors] = useState([]);

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput(""); 
    }
  };
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const newPost = { title, content, tags };

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

        <label>Tags (Press Enter to Add)</label>
        <div className="tag-input-container">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
            placeholder="Add Tag here..."
          />
          <button type="button" onClick={handleAddTag}>Add</button>
        </div>

        <div className="tags-list">
          {tags.map(tag => (
            <span key={tag} className="tag-item">
              {tag} <button type="button" onClick={() => handleRemoveTag(tag)}>x</button>
            </span>
          ))}
        </div>

        <button type="submit">Complete Forum</button>
      </form>
    </div>
  );
}

export default ForumPostForm;
