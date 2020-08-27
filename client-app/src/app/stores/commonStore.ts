import { RootStore } from "./rootStore";
import { observable, action, reaction } from "mobx";

export default class CommonStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        reaction(
            //react on token 
            () => this.token,
            token => {
                if (token) {
                    //if we have a token, sets it inside the local storage
                    window.localStorage.setItem('jwt', token);
                } else {
                    //if we don't have a token, it removes the token
                    window.localStorage.removeItem('jwt');
                }
            }
        )
    }

    @observable token: string | null = window.localStorage.getItem('jwt');
    @observable appLoaded = false;

    @action setToken = (token: string | null) => {
        //save the token in the browser's local storage
        window.localStorage.setItem('jwt', token!);
        this.token = token
    }

    @action setAppLoaded = () => {
        this.appLoaded = true;
    }
}