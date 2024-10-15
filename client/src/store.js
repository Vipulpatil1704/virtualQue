import { configureStore } from '@reduxjs/toolkit';
import ridesReducer from './slices/ridesSlice';  // Ensure correct path
import ticketsReducer from './slices/ticketsSlice';

const store = configureStore({
  reducer: {
    ridesReducer,   // This needs to be correctly referenced
    ticketsReducer  // Any other reducers if you have
  }
});

export default store;


// import { configureStore } from "@reduxjs/toolkit";
// import ticketsReducer from "./slices/ticketsSlice";
// import businessReducer from "./slices/ridesSlice";
// import { createStateSyncMiddleware, initStateWithPrevTab } from "redux-state-sync";

// const store = configureStore({
//     reducer: {
//         ticketsReducer,
//         businessReducer
//     },
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(createStateSyncMiddleware({})),
// });

// initStateWithPrevTab(store);
// export default store
