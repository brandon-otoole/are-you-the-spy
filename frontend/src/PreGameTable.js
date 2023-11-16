//import Button from "@mui/material/Button";

import { connect } from 'react-redux';

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(record) {
    const ready = record.ready ? "✔" : "";
    return { id: record.id, status:ready, name:record.name, remove:"x" };
}

const mapStateToProps = (state) => {
   return {
      players: state.game.players,
   };
};

const mapDispatchToProps = (dispatch) => {
   return { };
};

function PreGameTable(props) {
    const { players } = props;

    let rows = players ? players.map(x => createData(x)) : [];

    return (
      <TableContainer align="center" sx={{ maxWidth: 700 }}component={Paper}>
        <Table align="center" sx={{ maxWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Status</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="center">Boot?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell align="center">{row.status}</TableCell>
              <TableCell align="left">{row.name}</TableCell>
              <TableCell align="center">{row.remove}</TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );

}

export default connect(mapStateToProps, mapDispatchToProps)(PreGameTable);
