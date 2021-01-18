import React, { useEffect } from 'react';
import { Route } from 'react-router';
import PubSub from 'pubsub-js';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { CheckForNewServiceWorkerTopic } from './utilities/SubjectTopics';

import './custom.css'

function App() {  

    useEffect(() => {
        PubSub.publish(CheckForNewServiceWorkerTopic);
        const versionTimer = setInterval(() => PubSub.publish(CheckForNewServiceWorkerTopic), 600000);

        return () => clearInterval(versionTimer);
    }, []); 
   
  
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data' component={FetchData} />
      </Layout>
    );
    
}

export default App;
