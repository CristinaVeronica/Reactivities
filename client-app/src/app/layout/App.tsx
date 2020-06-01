import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import { NavBar } from '../../features/nav/NavBar';
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity: IActivity) => {
    //create a new activity
    setActivities([...activities, activity])
    //display the newly created activity
    setSelectedActivity(activity);
    setEditMode(false);
  }

  //activities which don't match the id from activity received as parameter
  const handleEditActivity = (activity: IActivity) => {
    setActivities([...activities.filter(a => a.id !== activity.id), activity])
    // set updated activity
    setSelectedActivity(activity);
    setEditMode(false); 
  }

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(a => a.id !== id)])
  }

  //second parameter "[]" ensures that useEffect runs only one time, not many times
  // if you don't  put, the component will enter into an infinite loop
  useEffect(() => {
    axios
    .get<IActivity[]>('http://localhost:5000/api/activities')
    .then((response) => {
      let activities: IActivity[] = [];
      response.data.forEach(activity => {
        activity.date = activity.date.split('.')[0];
        activities.push(activity);
      })
      setActivities(response.data)
    });
  }, []);

    return (
      <Fragment>
        <NavBar openCreateForm={handleOpenCreateForm}/>
        <Container style={{marginTop: '7em'}}>
          <ActivityDashboard
           activities={activities}
           selectActivity={handleSelectActivity}
           selectedActivity={selectedActivity}
           editMode={editMode}
           setEditMode={setEditMode}
           setSelectedActivity={setSelectedActivity}
           createActivity={handleCreateActivity}
           editActivity={handleEditActivity}
           deleteActivity={handleDeleteActivity}
           />
        </Container>
      </Fragment>
    );

}

export default App;
