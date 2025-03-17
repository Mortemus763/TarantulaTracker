import { useState } from "react";
import { useDispatch } from "react-redux";
import { editForum, fetchForums } from "../../redux/forum";
import { useModal } from "../../context/Modal";

function EditForumPostForm({ forum }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [title, setTitle] = useState(forum.title);
  const [content, setContent] = useState(forum.content);
  const [tags, setTags] = useState(forum.tags.map(tag => tag.name) || []);
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState([]);

  const handleTagAdd = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()]);
      setNewTag("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const updatedForum = { title, content, tags };

    try {
      await dispatch(editForum({ forumId: forum.id, forumData: updatedForum }));
      dispatch(fetchForums());
      closeModal();
    } catch (err) {
      setErrors(["Failed to update forum post"]);
    }
  };

  return (
    <div className="forum-form-container"> 
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

        {/* Tags Section */}
        <label>Tags</label>
        <div className="tag-input-container">
          <input
            type="text"
            value={newTag}
            placeholder="Add a tag..."
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button type="button" onClick={handleTagAdd}>
            Add Tag
          </button>
        </div>
        
        <div className="tags-list">
          {tags.map((tag, index) => (
            <span key={index} className="tag-item">
              {tag} <button type="button" onClick={() => handleTagRemove(tag)}>x</button>
            </span>
          ))}
        </div>

        <button type="submit">Update Forum</button>
      </form>
    </div>
  );
}

export default EditForumPostForm;
