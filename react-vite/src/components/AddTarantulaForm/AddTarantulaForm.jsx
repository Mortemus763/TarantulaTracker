import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTarantula, fetchTarantulas } from "../../redux/tarantulas";
import { useModal } from "../../context/Modal";
import "./AddTarantulaForm.css";

function TarantulaForm() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [species, setSpecies] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // Ensure species is required
    if (!species.trim()) {
      setErrors(["Species is required"]);
      return;
    }

    const newTarantula = {
      species,
      name: name.trim() ? name : null,
      age: age || null,
      description: description || null,
      location: location || null,
      image: image || null,
    };

    try {
      await dispatch(addTarantula(newTarantula)).unwrap(); 
      dispatch(fetchTarantulas());  
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

        <div className="form-group">
          <label>Species <span className="required">*</span></label>
          <input type="text" value={species} onChange={(e) => setSpecies(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Name (Optional)</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Age (Optional)</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Location (Optional)</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Image URL (Optional)</label>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default TarantulaForm;
