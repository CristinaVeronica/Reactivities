import { RootStore } from './rootStore';
import { observable, runInAction, action, computed } from 'mobx';
import { IProfile, IPhoto } from '../models/profile';
import agent from '../api/agent';
import { toast } from 'react-toastify';

export default class ProfileStore {
  rootstore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootstore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;

  @computed get isCurrentUser() {
    if (this.rootstore.userStore.user && this.profile) {
      return this.rootstore.userStore.user.username === this.profile.username;
    } else {
      return false;
    }
  }

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootstore.userStore.user) {
            this.rootstore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem uploading photo');
      runInAction(() => {
        this.loadingProfile = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction(() => {
        this.rootstore.userStore.user!.image = photo.url;
        //get the main photo and set this as false
        this.profile!.photos.find((a) => a.isMain)!.isMain = false;
        //find the photo that matches the id from param and set it as main
        this.profile!.photos.find((a) => a.id === photo.id)!.isMain = true;
        // set the profile image itself
        this.profile!.image = photo.url;
        //turn off loading indicator
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem setting photo as main');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        // remove the photo from profile photos array
        //and not allow the user to delete his main photo
        this.profile!.photos = this.profile!.photos.filter(
          (a) => a.id !== photo.id
        );
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem deleteing the photo');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action updateProfile = async (profile: Partial<IProfile>) => {
    try {
      await agent.Profiles.updateProfile(profile);
      runInAction(() => {
        if (
          profile.displayName !== this.rootstore.userStore.user!.displayName
        ) {
          this.rootstore.userStore.user!.displayName = profile.displayName!;
        }
        //updating the profile. ...this.profile! takes the existing profile 
        // and ... profile overrides the new properties
        this.profile = { ...this.profile!, ...profile };
      });
    } catch (error) {
      toast.error('Problem updating profile');
    }
  };
}
