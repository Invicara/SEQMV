import React,{useState} from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Notification = (props) => {

        // const [state, setState] = useState({
        //   openMsg: false,
        //   vertical: 'top',
        //   horizontal: 'right',
        // });
      
        // const { vertical, horizontal } = state;

return (
    <>
          <Snackbar
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={props.open}
                  key="topright"
                >
                  <Alert
                  iconMapping={{
                    success: <CheckCircleIcon fontSize="inherit" />,
                  }}
                  onClose={props.onClose} severity={props.successOrErr.toLowerCase()}>
                  <AlertTitle>{props.successOrErr}</AlertTitle>
                    {props.message}
                  </Alert>
                </Snackbar>
                </>
)
}

export default Notification