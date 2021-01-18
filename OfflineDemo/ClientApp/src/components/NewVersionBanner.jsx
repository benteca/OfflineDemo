import React from 'react';
import PubSub from 'pubsub-js';
import { CheckForNewServiceWorkerTopic, UpdateServiceWorkerTopic } from '../utilities/SubjectTopics';

class NewVersionBanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isNewVersionAvailable: false,
            showNewVersionAvailable: false,
            seviceWorkerToInstall: undefined
        };

        this.checkForNewServiceWorkerSubscriber = this.checkForNewServiceWorkerSubscriber.bind(this);
        this.handleUpdateServiceWorkerSubscriber = this.handleUpdateServiceWorkerSubscriber.bind(this);
    }

    componentDidMount() {
        PubSub.subscribe(UpdateServiceWorkerTopic, this.handleUpdateServiceWorkerSubscriber);
        PubSub.subscribe(CheckForNewServiceWorkerTopic, this.checkForNewServiceWorkerSubscriber);
    }

    compnentWillUnmount() {
        PubSub.unsubscribe(this.handleUpdateServiceWorkerSubscriber);
        PubSub.unsubscribe(this.checkForNewServiceWorkerSubscriber);
    }

    async checkForNewServiceWorkerSubscriber(msg, data) {
        if (!navigator.onLine) {
            return;
        }

        //Looking for waiting service worker
        await navigator.serviceWorker.getRegistrations()
            .then(registrations => {
                var waitingSW;
                if (registrations[0] && registrations[0].waiting && registrations[0].waiting.serviceWorker) {
                    waitingSW = registrations[0].waiting.serviceWorker;
                }
                this.setState({ serviceWorkerToInstall: waitingSW });
            })
            .catch(er => { });

        if (this.state.serviceWorkerToInstall) {
            //Waiting service worker found, showing new version banner
            console.log('Ready to show new version banner');
            this.setState({
                isNewVersionAvailable: true,
                showNewVersionAvailable: true
            });
        }
        else {
            //No waiting service worker found, trying to update service worker registration manually
            await navigator.serviceWorker.getRegistrations()
                .then(registrations => {
                    var currentServiceWorker = registrations[0];

                    if (currentServiceWorker) {
                        currentServiceWorker.update();
                    }
                });
        }
    }

    handleUpdateServiceWorkerSubscriber(msg, data) {
        if (!navigator.onLine) {
            return;
        }

        if (data) {
            //New service worker is available
            this.setState({
                isNewVersionAvailable: true,
                serviceWorkerToInstall: data,
                showNewVersionAvailable: true
            });
        }
    }

    async reloadPage() {
        if (!navigator.onLine) {
            return;
        }

        var installingServiceWorker = this.state.serviceWorkerToInstall;

        if (installingServiceWorker) {            
            this.setState({ isNewVersionAvailable: false });
            installingServiceWorker.addEventListener('statechange', e => {
                if (e.target.state === 'activated') {
                    window.location.reload();
                }
            });
            installingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
        }
    }

    handleCloseNewVersion() {
        this.setState({ showNewVersionAvailable: false });
    }

    render() {
        return (
            <React.Fragment>
                {
                    (this.state.isNewVersionAvailable && this.state.showNewVersionAvailable) ?
                        <div className="new-version-container">
                            <div className="new-version-content">
                                <div className="new-version-content-text">
                                    En ny versjon er tilgjengelig. <span className="new-version-update" onClick={() => this.reloadPage()}>Oppdater</span>
                                </div>
                                <div className="new-version-close">
                                    <button className="btn btn-primary"  onClick={() => this.handleCloseNewVersion()} />
                                </div>
                            </div>
                        </div>
                        : null
                }
            </React.Fragment>
        );
    }
}

export default NewVersionBanner;