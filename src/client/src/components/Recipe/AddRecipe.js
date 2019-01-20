import React from 'react'

const initState = {
  name: '',
  category: 'Breakfast',
  description: '',
  instructions: '',
  username: ''
}

class AddRecipe extends React.Component {
  state = { ...initState }

  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  render() {
    const { name, category, description, instructions, username } = this.state

    return (
      <div className="App">
        <h2 className="App">Add Recipe</h2>
        <form className="form">
          <input
            type="text"
            name="name"
            placeholder="Recipe Name"
            value={name}
            onChange={this.handleChange}
          />
          <select name="category" value={category} onChange={this.handleChange}>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
          <input
            type="text"
            name="description"
            placeholder="Add Description"
            value={description}
            onChange={this.handleChange}
          />
          <textarea
            name="instructions"
            placeholder="Add Instructions"
            rows="10"
            value={instructions}
            onChange={this.handleChange}
          />

          <button type="submit" className="button-primary">
            SUBMIT
          </button>
        </form>
      </div>
    )
  }
}

export default AddRecipe
