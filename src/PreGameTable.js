import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function PreGame(props) {
    const rows = props.rows;

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
            <TableRow key={row.name}>
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

export default PreGame;
