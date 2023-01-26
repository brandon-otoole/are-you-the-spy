import React from 'react';

class NameForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.updateName(event.target.value);
    }

    render() {
        const { name } = this.props;

        return(
            <form>
              <label>
                Name: <input type="text" value={name} onChange={this.handleChange} />
              </label>
            </form>
        )
    }
}

export default NameForm
