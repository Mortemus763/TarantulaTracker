import { useDispatch } from "react-redux";
import { deleteForum } from "../../redux/forum";
import { useModal } from "../../context/Modal";
import "./DeleteForumPostModal.css";

function DeleteForumPostModal({ forumId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    await dispatch(deleteForum(forumId));
    closeModal();
  };

  return (
    <div className="delete-modal-container">
      <h2>Are you sure you want to delete this forum post?</h2>
      <div className="delete-modal-actions">
        <button className="confirm-delete" onClick={handleDelete}>Yes</button>
        <button className="cancel-delete" onClick={closeModal}>No</button>
      </div>
    </div>
  );
}

export default DeleteForumPostModal;
