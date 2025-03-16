import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTarantula } from "../../redux/tarantulas";
import { useModal } from "../../context/Modal";
import "./EditTarantulaForm.css";

function EditTarantulaForm({ tarantula }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [species, setSpecies] = useState(tarantula.species);
  const [name, setName] = useState(tarantula.name || "");
  const [age, setAge] = useState(tarantula.age || "");
  const [description, setDescription] = useState(tarantula.description || "");
  const [location, setLocation] = useState(tarantula.location || "");
  const [image, setImage] = useState(tarantula.image || "");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
  
    if (!species.trim()) {
      setErrors(["Species is required"]);
      return;
    }
  
    const updatedTarantula = {
      id: tarantula.id,
      species,
      name: name.trim() || null,
      age: age || null,
      description: description.trim() || null,
      location: location.trim() || null,
      image: image.trim() || null,
    };
  
    try {
      const resultAction = await dispatch(updateTarantula(updatedTarantula));
  
      if (updateTarantula.fulfilled.match(resultAction)) {
        closeModal(); 
      } else {
        setErrors(["Failed to update tarantula"]);
      }
    } catch (err) {
      setErrors(["Failed to update tarantula"]);
    }
  };

  return (
    <div className="tarantula-form-container">
      <h2>Edit Tarantula</h2>
      <form onSubmit={handleSubmit}>
        {errors.length > 0 && <p className="error">{errors[0]}</p>}

        <div className="form-group">
          <label>Species <span className="required">*</span></label>
          <input 
            type="text" 
            value={species} 
            onChange={(e) => setSpecies(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Name (Optional)</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label>Age (Optional)</label>
          <input 
            type="number" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label>Location (Optional)</label>
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label>Image URL (Optional)</label>
          <input 
            type="text" 
            value={image} 
            onChange={(e) => setImage(e.target.value)} 
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditTarantulaForm;
