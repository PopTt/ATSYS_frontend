import { makeStyles } from '@mui/styles';

export const useGlobalStyles = makeStyles((theme) => ({
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    textAlign: 'center',
    transform: 'translate(-50%, -50%)',
  },
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stayRight: {
    marginLeft: 'auto',
  },
}));
