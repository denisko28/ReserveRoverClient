import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import placesReducer from "./slices/placesSlice";
import placeDetailsReducer from "./slices/placeDetailsSlice";
import userRoleReducer from "./slices/userInfoSlice";
import citiesReducer from "./slices/citiesSlice";
import rservationsReducer from "./slices/reservationSlice";
import friendsReducer from "./slices/friendsSlice";
import moderationsReducer from "./slices/moderationsSlice";
import tableSetsReducer from "./slices/tableSetsSlice";

const userInfoPersistConfig = {
  key: "userInfo",
  storage,
};

const comboReducer = combineReducers({
  userInfo: persistReducer(userInfoPersistConfig, userRoleReducer),
  places: placesReducer,
  placeDetails: placeDetailsReducer,
  cities: citiesReducer,
  reservations: rservationsReducer,
  friends: friendsReducer,
  moderations: moderationsReducer,
  tableSets: tableSetsReducer
});

export const store = configureStore({
  reducer: comboReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
