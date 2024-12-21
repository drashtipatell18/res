import { combineReducers } from "redux";
import itemsSlice from "./slice/Items.slice"
import boxSlice from "./slice/box.slice"
import kdsSlice from "./slice/kds.slice"
import orderSlice from "./slice/order.slice"
import tableSlice from "./slice/table.slice"
import userSlice from "./slice/user.slice"

export const  rootReducer = combineReducers({
  items:itemsSlice,
  boxs:boxSlice,
  kds:kdsSlice,
  orders:orderSlice,
  tables:tableSlice,
  user:userSlice,
});
