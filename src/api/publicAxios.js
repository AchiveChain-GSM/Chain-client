import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://port-0-chain-server-mjgfqy3sbea3654a.sel3.cloudtype.app';

const publicApi = axios.create({
  baseURL: API_BASE_URL,
});

export default publicApi;
