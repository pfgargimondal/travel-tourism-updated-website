import axios from 'axios';
export default axios.create({
    baseURL:"https://travel-tourism-backend.workstream.club/api/",
    headers:{
        "Content-Type":"application/json"
    }
})