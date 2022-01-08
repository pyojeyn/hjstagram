import {
    LOGIN_USER,
    REGISTER_USER,
    CHECK_USER,
    SEND_EMAIL
} from '../_actions/types';

export default function (state= {}, action){
    switch (action.type) { // 다른 type이 올때마다 다른 조취를 취해야 하기 때문에 switch로 처리
        case LOGIN_USER:
             return {...state, LoginSuccess: action.payload} //action.payload == 서버에서 가져온 response
            break;
    
        case REGISTER_USER:
            return{...state, register: action.payload}
            break;

            case CHECK_USER:
                return{...state, check: action.payload}
                break;

                case SEND_EMAIL:
                    return{...state, send: action.payload}
                    break;

        default:
            return state;
    }
}