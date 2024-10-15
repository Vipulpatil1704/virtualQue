// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// const initialState = {
//   areLoading: true,
//   hasError: false,
//   allBusiness: [],
//   rideId: 0
// };

// export const fetchRides = createAsyncThunk(
//   "fetchRides",
//   async () => {
//     const data = await axios.get(`/api/rides`)
//       .then(data => data.data)
//       .catch(err => console.log(err));
//     return data;
//   }
// );

// export const businessSlice = createSlice({
//   name: "business",
//   initialState,
//   reducers: {
//     updaterideId: (state, action) => { state.rideId = action.payload },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(fetchRides.fulfilled, (state, action) => {
//       state.allBusiness = action.payload
//       state.areLoading = false;
//     });

//     builder.addCase(fetchRides.rejected, (state) => {
//       state.hasError = true;
//     });
//   },
// });


// export const getRideById = (store, id) =>
//   store.businessReducer.allBusiness.find(b => b.id == id);

// export const { updaterideId } = businessSlice.actions;
// export default businessSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state with a fallback for allRides
const initialState = {
  allRides: [],  // Ensuring a default empty array
  loading: false,
  error: null,
  status:'idle',
};

// Async thunk to fetch rides
export const fetchRides = createAsyncThunk('rides/fetchRides', async () => {
  try {
    const response = await axios.get('/api/rides'); // Ensure this is your actual API URL
    // Assuming the API returns an array of rides, each with the necessary information
    const rides = response.data.rides;
    // Add any calculations for waiting time, queue length, etc. here
    // const updatedRides = rides.map(ride => {
    //   const queueLength = ride.queue.length;  // Assuming a 'queue' array exists
    //   const waitingTime = queueLength * 5;  // For example, 5 minutes per person in queue
      
    //   return {
    //     ...ride,
    //     queueLength,
    //     waitingTime,
    //     peopleInQueue: queueLength // Add this to each ride
    //   };
    // });

    // return updatedRides; // Return the updated rides array with the new data
    return rides;
  } catch (error) {
    throw new Error(error.message); // Handle the error
  }
});

// A selector to get a ride by its ID
export const getRideById = (state, id) => {
  return state.ridesReducer.allRides.find(ride => ride.id === id);
};

// Async thunk to update a ride by its ID
export const updateRideId = createAsyncThunk('rides/updateRideId', async ({ id, updatedData }) => {
  try {
    const response = await axios.put(`/api/rides/${id}`, updatedData); // Update with your actual API URL
    return response.data; // Assuming the data is in response.data
  } catch (error) {
    throw new Error(error.message); // Handle the error
  }
});

// Your slice
const ridesSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    setRidesLoading: (state) => {
      state.loading = true;
    },
    setRidesError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setRidesData: (state, action) => {
      state.allRides = action.payload;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    // Handle the pending, fulfilled, and rejected states for fetching rides
    builder
      .addCase(fetchRides.pending, (state) => {
        state.loading = true; // Set loading to true when the request starts
        state.error = null;   // Reset any previous errors
      })
      .addCase(fetchRides.fulfilled, (state, action) => {
        state.allRides = action.payload; // Save the fetched rides to state
        state.loading = false;     // Set loading to false once done
      })
      .addCase(fetchRides.rejected, (state, action) => {
        state.error = action.error.message; // Capture any errors that occurred
        state.loading = false;               // Set loading to false on error
      })
      // Handle the update ride logic
      .addCase(updateRideId.fulfilled, (state, action) => {
        const index = state.allRides.findIndex(ride => ride.id === action.payload.id);
        if (index !== -1) {
          state.allRides[index] = action.payload; // Update the ride data in the state
        }
        state.loading = false;
      })
      .addCase(updateRideId.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export const { setRidesLoading, setRidesError, setRidesData } = ridesSlice.actions;
export default ridesSlice.reducer;
