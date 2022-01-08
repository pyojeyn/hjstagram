import axios from "axios";
import {
    LOGIN_USER,
    REGISTER_USER,
    CHECK_USER,
    SEND_EMAIL
} from './types';

export function LoginUser(dataToSubmit) {   // body를 dataToSubmit파라미터를 통해 전달받음

const request = axios.post('api/auth/login', dataToSubmit)  // 서버에서 받은 data를 request에 저장
    .then(response => response.data)

    // return을 시켜서 reducer 로 보냄 
    return{ 
        type: LOGIN_USER,
        payload: request
    }
} 

export function registerUser(dataToSubmit) {

    const request = axios.post('api/auth/register', dataToSubmit)
        .then(response => response.data)
    
        
        return{ 
            type: REGISTER_USER,
            payload: request
        }
    } 

    export function CheckUser(dataToSubmit) {

        const request = axios.get('api/auth/check', dataToSubmit)
            .then(response => response.data)
        
            
            return{ 
                type: CHECK_USER,
                payload: request
            }
        } 

    export function SendEmail(dataToSubmit) {

        const request = axios.post('/api/auth/sendemail', dataToSubmit)
            .then(response => response.data)
        
            
            return{ 
                type: SEND_EMAIL,
                payload: request
            }
        } 
    