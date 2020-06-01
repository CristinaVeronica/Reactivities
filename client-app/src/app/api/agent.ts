import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';


//set axios default for our API
axios.defaults.baseURL = 'http://localhost:5000/api';

// store our request
const responseBody = (response: AxiosResponse) => response.data;


//delay our requests
const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));


// create response data
const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
    del: (url:string) => axios.delete(url).then(sleep(1000)).then(responseBody)
}

// all our activities request will gonna go in this:
const Activities = {
    //get a list of activities in our APi
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`)
}

export default {
    Activities
}