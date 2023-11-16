import React from 'react';

import TextField from "@mui/material/TextField";

class JoinForm extends React.Component {
              //<input type="text" value={id} onChange={this.handleChange}
                     //placeholder="or enter Join Code" />
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
            <TextField variant="outlined"
            id="join-code" label="Join Code" onChange={this.handleChange} />
        )
    }
}

export default JoinForm;

