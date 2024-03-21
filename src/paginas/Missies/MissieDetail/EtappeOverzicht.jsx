import { GetMissieDagen } from "../../../components/DatumFuncties"
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const EtappeOverzicht = ({ missieId,startDatum, eindDatum }) => {

  const missiedagen = GetMissieDagen(startDatum, eindDatum)

const {data, isLoading, isError} = useQuery({
  queryKey: ['missieetappes',missieId],
  queryFn: async ()=>{
    const response = await axiosPrivate.get(`${axiosUrls('GetMissieEtappes')}?missieid=${missieId}`);
    console.log(response.data)
    return response.data
  }
})

  return (
    <div>EtappesOverzicht</div>
  )
}

export default EtappeOverzicht