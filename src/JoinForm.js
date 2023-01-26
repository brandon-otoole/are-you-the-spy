import React from 'react';

class JoinForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.updateId(event.target.value);
    }

    render() {
        const { id } = this.props;

        return(
              <input type="text" value={id} onChange={this.handleChange}
                     placeholder="or enter Join Code" />
        )
    }
}

export default JoinForm
