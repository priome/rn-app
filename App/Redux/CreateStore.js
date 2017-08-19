import { createStore, applyMiddleware, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';
import { reactReduxFirebase } from 'react-redux-firebase';
import RNFirebase from 'react-native-firebase';
//import FirebaseConfig from '../Config/FirebaseConfig';
import Config from '../Config/DebugConfig';
import createSagaMiddleware from 'redux-saga';
import RehydrationServices from '../Services/RehydrationServices';
import ReduxPersist from '../Config/ReduxPersist';
import ScreenTracking from './ScreenTrackingMiddleware';

// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */

  const middleware = [];
  const enhancers = [];

  /* ------------- Analytics Middleware ------------- */
  middleware.push(ScreenTracking);

  /* ------------- Saga Middleware ------------- */

  const sagaMonitor = Config.useReactotron
    ? console.tron.createSagaMonitor()
    : null;
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
  middleware.push(sagaMiddleware);

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware));

  /* ------------- AutoRehydrate Enhancer ------------- */

  // add the autoRehydrate enhancer
  if (ReduxPersist.active) {
    enhancers.push(autoRehydrate());
  }

  /* ------------- Firebase ------------- */
  const firebase = RNFirebase.initializeApp({ debug: __DEV__ });
  enhancers.push(reactReduxFirebase(firebase, { userProfile: 'users', enableRedirectHandling: false }));

  // if Reactotron is enabled (default for __DEV__), we'll create the store through Reactotron
  const createAppropriateStore = Config.useReactotron
    ? console.tron.createStore
    : createStore;
  const store = createAppropriateStore(rootReducer, compose(...enhancers));

  // configure persistStore and check reducer version number
  if (ReduxPersist.active) {
    RehydrationServices.updateReducers(store);
  }

  // kick off root saga
  sagaMiddleware.run(rootSaga);

  return store;
};
