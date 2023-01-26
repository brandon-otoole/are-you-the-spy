import React from "react";

class Join extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentWillUnmount() {
    }

    async componentDidMount() {
    }

    componentDidUpdate() {
        console.log("join lifecycle: ", "did update");
    }

    render() {
        return (
            <div className="App">
            <header className="App-header">
                <p>
                Edit <code>src/Join.js</code> and save to reload.
                </p>
                <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
                >
                Learn How To React Bitterly
                </a>
            </header>
            </div>
        );
    }

}

export default Join;
