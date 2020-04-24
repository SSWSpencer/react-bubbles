import React, { useState } from "react";
import {axiosWithAuth} from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [newColor, setNewColor] = useState({
    color: "",
    code: {
      hex: ""
    },
    id: parseInt(Date.now())
  })

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    axiosWithAuth()
      .put(`/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(res=>{
        let newArr = colors.filter(i => i.id !== colorToEdit.id)
        newArr.push(colorToEdit)
        newArr.sort((a,b) => a.id - b.id)
        updateColors(newArr);
      })
      .catch(err=> console.log(err))
    
  };

  const deleteColor = color => {
    axiosWithAuth()
      .delete(`/api/colors/${color.id}`)
      .then(res=>{
        let newArr = colors.filter(i=> i.id != color.id)
        updateColors(newArr);
      })
      .catch(err=> console.log(err))
  };

  const handleNewColorChange = e =>{
    setNewColor({
      ...newColor,
      color: e.target.value
    })
  }

  const handleNewHexChange = e =>{
    setNewColor({
      ...newColor,
      code: {
        hex: e.target.value
      }
    })
  }

  const addNewColor = e =>{
    e.preventDefault();
    axiosWithAuth()
      .post('/api/colors', newColor)
      .then(res=> {
        window.location.reload(false);
      })
      .catch(err => console.log(err))
  }



  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={e => {
                    e.stopPropagation();
                    deleteColor(color)
                  }
                }>
                  x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      <form>
        <input 
        type="text"
        placeholder="New Color Name"
        name="color"
        value={newColor.color}
        onChange={handleNewColorChange}/>
        <input 
        type="text"
        placeholder="New Color Hex Value"
        value={newColor.code.hex}
        onChange={handleNewHexChange}
        />
        <button onClick={addNewColor}>Add New Color</button>
      </form>
    </div>
  );
};

export default ColorList;
