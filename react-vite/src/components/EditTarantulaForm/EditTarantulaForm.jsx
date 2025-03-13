import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTarantula } from "../../redux/tarantulas";
import { useModal } from "../../context/Modal";


function EditTarantulaForm({ tarantula }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  // Pre-populating values from the tarantula prop
  const [name, setName] = useState(tarantula.name);
  const [description, setDescription] = useState(tarantula.description);
  const [location, setLocation] = useState(tarantula.location || "");
  const [image, setImage] = useState(tarantula.image || "");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const updatedTarantula = {
      id: tarantula.id, // Ensure ID is included for API update
      name,
      description,
      location,
      image,
    };

    try {
      await dispatch(updateTarantula(updatedTarantula));
      closeModal(); // Close modal on success
    } catch (err) {
      setErrors(["Failed to update tarantula"]);
    }
  };

  return (
    <div className="tarantula-form-container">
      <h2>Edit Tarantula</h2>
      <form onSubmit={handleSubmit}>
        {errors.length > 0 && <p className="error">{errors[0]}</p>}

        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>Location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />

        <label>Image URL</label>
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditTarantulaForm;
