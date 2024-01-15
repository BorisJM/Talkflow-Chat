import { createSlice} from "@reduxjs/toolkit";

const initialState = {
  showVolumeIndicator: false,
  tracks: {
    localAudioTrack: null,
    remoteAudioTracks: {},
    localVideoTrack: null,
    remoteVideoTracks: {}
  },
  showCam: false,
  userCam: false,
  isLightTheme: true
};


const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    // set Volume Indicator
    setShowVolumeIndicator(state, action) {
      state.showVolumeIndicator = action.payload;
    },
    // set Tracks
    setTracks(state, action) {
      state.tracks = action.payload
    },
    setAudioTracks(state, action) {
      state.tracks = {...state.tracks, remoteAudioTracks: action.payload}
    },
    setVideoTracks(state,action) {
      state.tracks = {...state.tracks, remoteVideoTracks: action.payload}
    },
    // Reset tracks after user left
    setUserLeft(state,action) {
      state.tracks = {
        localAudioTrack: state.tracks.localAudioTrack,
        remoteAudioTracks: {},
        localVideoTrack: state.tracks.localVideoTrack,
        remoteVideoTracks: {}
      }
    },
    setLeaveRoom(state) {
      state.tracks = {
        localAudioTrack: null,
        remoteAudioTracks: {},
        localVideoTrack: null,
        remoteVideoTracks: {}
      }
    },
    // Show video cam
    setShowCam(state, action) {
      state.showCam = action.payload
    },
    // Set user cam
setUserCam(state, action) {
  state.userCam = action.payload
},
// Set Page theme
setWebsiteTheme(state, action) {
  state.isLightTheme = action.payload
}
   },
});

export const { setShowVolumeIndicator, setLeaveRoom, setTracks, setAudioTracks, setVideoTracks, setUserLeft , setShowCam, setUserCam , setWebsiteTheme} = featuresSlice.actions;

export default featuresSlice.reducer;
