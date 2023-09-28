import React from 'react';

class NameForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.props.updateName(event.target.value);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.submitHandler();
    }

    render() {
        const { name } = this.props;

        return(
            <form onSubmit={this.handleSubmit}>
              <label>
                Name: <input type="text" value={name} onChange={this.handleChange} />
              </label>
            </form>
        )
    }
}

export default NameForm
