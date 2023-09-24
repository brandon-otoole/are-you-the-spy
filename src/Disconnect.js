import Button from "@mui/material/Button";

import { connect } from 'react-redux'

const S2P = (state) => {
   return { };
};

const D2P = (dispatch) => {
   return {
       breakConnection: () => dispatch({
           type: "WS_TEST_BREAK",
       }),
   };
};

function Disconnect(props) {
    const { breakConnection } = props;

    return (
      <div>
        <Button variant="contained" disabled={!true}
                onClick={breakConnection}>
          Break Connection
        </Button>
      </div>
    );
}

export default connect(S2P, D2P)(Disconnect);
