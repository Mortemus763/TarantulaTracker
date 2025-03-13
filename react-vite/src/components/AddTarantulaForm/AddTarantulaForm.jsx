import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTarantula } from "../../redux/tarantulas";
import { useModal } from "../../context/Modal";
import "./AddTarantulaForm.css";

function TarantulaForm() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const newTarantula = {
      name,
      description,
      location,
      image,
    };

    try {
      await dispatch(addTarantula(newTarantula));
      closeModal(); 
    } catch (err) {
      setErrors(["Failed to add tarantula"]);
    }
  };

  return (
    <div className="tarantula-form-container">
      <h2>Add a New Tarantula</h2>
      <form onSubmit={handleSubmit}>
        {errors.length > 0 && <p className="error">{errors[0]}</p>}

        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>Location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />

        <label>Image URL</label>
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default TarantulaForm;
