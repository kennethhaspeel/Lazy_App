import { axiosPrivate,axiosUrls } from "./axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const missionEndpoint = '/missie'


export const getMissions = async ()=>{
    const axiospr = useAxiosPrivate()
    const response = await axiospr.get(`${missionEndpoint}/GetAllMissions`)
    console.log(response.data)
    return response.data
}
