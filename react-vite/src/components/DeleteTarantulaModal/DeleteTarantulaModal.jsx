import { useDispatch } from "react-redux";
import { deleteTarantula } from "../../redux/tarantulas";
import { useModal } from "../../context/Modal";
import "./DeleteTarantulaModal.css"; 

function DeleteTarantulaModal({ tarantulaId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    await dispatch(deleteTarantula(tarantulaId));
    closeModal(); 
  };

  return (
    <div className="delete-modal-container-tarantula">
      <h2>Are you sure you want to delete this tarantula?</h2>
      <div className="delete-modal-actions">
        <button className="confirm-delete" onClick={handleDelete}>Yes</button>
        <button className="cancel-delete" onClick={closeModal}>No</button>
      </div>
    </div>
  );
}

export default DeleteTarantulaModal;
