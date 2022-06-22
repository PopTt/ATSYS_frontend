import { makeStyles } from '@mui/styles';

export const useGlobalStyles = makeStyles((theme) => ({
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    textAlign: 'center',
    transform: 'translate(-50%, -50%)',
  },
  flexCenter: {
    display: 'block',
    justifyContent: 'center',
    textAlign: 'center',
  },
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stayRight: {
    marginLeft: 'auto',
  },
  iconBox: {
    width: '40px',
    borderRight: '1px solid #F9FAFE',
    marginRight: '40px',
  },
  icon: {
    cursor: 'pointer',
    marginLeft: '15px',
    fontSize: '1.7em',
    marginTop: '10px',
    marginLeft: '-10px',
  },
}));
