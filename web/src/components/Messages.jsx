import React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


/** v */
export default function Messages({ messages }) {

  function createData(name, timestamp, is_premium, content) {
    const time = new Date(timestamp/1000000).toLocaleString().toString()
    console.log(time)
    return { name, time, is_premium, content};
  }

  /**name,time,is_vip,content */
  const rows = messages.map((arr,i) => {
    const premium_mark = arr[1].is_premium.toString() == "true"? <font color="red">YES!</font> : ""
    return createData(arr[0],arr[1].time,premium_mark,arr[1].content)
  }
  );

  return (

    <TableContainer component={Paper}>
    <Table sx={{ minWidth: 450 }} size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell>Account Name</TableCell>
          <TableCell align="right">posted_time</TableCell>
          <TableCell align="right">is_premium</TableCell>
          <TableCell align="right">content</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
          background = "#FAFAFA"
            key={row.name}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
               {row.name} 
            </TableCell>
            <TableCell align="right">{row.time}</TableCell>
            <TableCell align="right">{row.is_premium}</TableCell>
            <TableCell align="right">{row.content}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

  
  )
  
}

Messages.propTypes = {
  messages: PropTypes.array
};
