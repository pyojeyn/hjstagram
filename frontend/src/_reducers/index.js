// store안에 여러가지 reducer가 있음
// reducer은 state가 변화하는건을 보여준 뒤 변한 마지막 값을 return해주는 것이 reducer
// combineReducers 를 통해 rootReducer에서 하나로 합쳐주는 것
import { combineReducers } from "redux";
import user from './user_reducer';

const rootReducer = combineReducers({
    user,
})

export default rootReducer;