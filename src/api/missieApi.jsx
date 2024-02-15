import axios,{ axiosPrivate } from "./axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const missionEndpoint = '/missie'
const delay = () => new Promise(res => setTimeout(() => res(), 1000))

export const GetMissions = async () => {
    await delay()
    
    const response = await axiosPrivate.get(`${missionEndpoint}/GetAllMissions`)
    return response.data
}

