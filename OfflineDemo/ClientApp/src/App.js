import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PubSub from 'pubsub-js';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { CheckForNewServiceWorkerTopic } from './utilities/SubjectTopics';
import RouteOnlineOnly from './components/RouterOnlineOnly.jsx';

import './custom.css'

function App() {  

    useEffect(() => {
        PubSub.publish(CheckForNewServiceWorkerTopic);
        const versionTimer = setInterval(() => PubSub.publish(CheckForNewServiceWorkerTopic), 600000);

        return () => clearInterval(versionTimer);
    }, []); 
   
  
    return (
        <Router>
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/counter' component={Counter} />
                <RouteOnlineOnly path='/fetch-data' component={FetchData} />
            </Layout>
        </Router>
    );
    
}

export default App;
