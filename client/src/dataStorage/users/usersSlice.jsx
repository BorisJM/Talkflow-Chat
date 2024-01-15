import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlinePeople: [],
  offlinePeople: [],
  foundedOnlinePeople: [],
  foundedOfflinePeople: [],
  allUsers: [],
  usersTalkingStatus: [],
  selectedUser: null,
  prevSelectedUser: null,
  showFoundedUsers: false,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Set Online People
    setOnlinePeople(state, action) {
      state.onlinePeople = action.payload;
    },
    // Set Offline People
    setOfflinePeople(state, action) {
      state.offlinePeople = action.payload;
    },
    // Set All Users
    setAllUsers(state, action) {
      state.allUsers = action.payload.filter(
        (u) => u.userId !== action.payload.id
      );
    },
    // Set selected User
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
    // Set previous selected user
    setPrevSelectedUser(state, action) {
      state.prevSelectedUser = action.payload;
    },
    setShowFoundedUsers(state, action) {
      state.showFoundedUsers = action.payload;
    },
    // Set founded Offline People
    setFoundedOfflinePeople(state, action) {
      state.foundedOfflinePeople = action.payload;
    },
    // Set founded Online People
    setFoundedOnlinePeople(state, action) {
      state.foundedOnlinePeople = action.payload;
    },
    // Set users talking status
    setUserTalkingStatus(state, action) {
      const data = [...state.usersTalkingStatus, action.payload].map(
        JSON.stringify
      );
      const uniqueData = new Set(data);
      const uniqueArray = Array.from(uniqueData).map(JSON.parse);
      state.usersTalkingStatus = uniqueArray;
    },
    // Reset users talking status
    setUsersResetTalkingStatus(state, action) {
      state.usersTalkingStatus = state.usersTalkingStatus.filter(
        (u) => !action.payload.filter((x) => x.id === u.id).length
      );
    },
  },
});

export const {
  setAllUsers,
  setOfflinePeople,
  setOnlinePeople,
  setSelectedUser,
  setPrevSelectedUser,
  setShowFoundedUsers,
  setUserTalkingStatus,
  setFoundedOfflinePeople,
  setFoundedOnlinePeople,
  setUsersResetTalkingStatus,
} = usersSlice.actions;

export default usersSlice.reducer;
