import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

axios.defaults.withCredentials = true;

const httpClient = axios.create({
  withCredentials: true,
});

export { httpClient };
