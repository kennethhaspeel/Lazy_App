import axios,{ axiosPrivate } from "./axios";

export const missionEndpoint = '/missie'
const delay = () => new Promise(res => setTimeout(() => res(), 1000))

export const GetMissions = async () => {
    await delay()
    
    const response = await axios.get(`${missionEndpoint}/GetAllMissions`)
    return response.data
}

