import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';
import { history } from '../../';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/user';

//set axios default for our API
axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use((config) => {
  //get access to our token
  const token = window.localStorage.getItem('jwt');
  //check to see if we've got a token
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config
}, error => {
  return Promise.reject(error);
})

axios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
        toast.error('Network error - make sure API is running!');
    }
    const {status, data, config} = error.response;
  if (status === 404) {
      history.push('/notfound');
  }
  if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
      history.push('/notfound');
  }
   if (status === 500) {
       toast.error('Server error - check the terminal for more info!')
   }
   throw error.response;
});

// store our request
const responseBody = (response: AxiosResponse) => response.data;

//delay our requests
const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

// create response data
const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(1000)).then(responseBody),
  del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
};

// all our activities request will gonna go in this:
const Activities = {
  //get a list of activities in our APi
  list: (): Promise<IActivity[]> => requests.get('/activities'),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post('/activities', activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => requests.del(`/activities/${id}/attend`)
};

const User = {
  current: (): Promise<IUser> => requests.get('/user'),
  login: (user: IUserFormValues): Promise<IUser> => requests.post('user/login', user),
  register: (user: IUserFormValues): Promise<IUser> => requests.post('user/register', user),
}

export default {
  Activities,
  User
};
