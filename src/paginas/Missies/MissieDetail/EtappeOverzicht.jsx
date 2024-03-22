import { CompareDates, DateToDDMMYYYY, GetMissieDagen, GetTijdFromDate, HHMM_To_date } from "../../../components/DatumFuncties"
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../../components/ErrorFallback";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../../api/axios";
import { Alert, ListGroup, ListGroupItem } from "react-bootstrap"

const EtappeOverzicht = ({ missieId, startDatum, eindDatum }) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const missiedagen = GetMissieDagen(startDatum, eindDatum)
  console.log(missiedagen)
  const { data: etappes, isLoading, isError } = useQuery({
    queryKey: ['missieetappes', missieId],
    queryFn: async () => {
      console.log(`${axiosUrls('GetMissieEtappes')}?missieid=${missieId}`)
      const response = await axiosPrivate.get(`${axiosUrls('GetMissieEtappes')}?missieid=${missieId}`);
      console.log(response.data)
      return response.data
    }
  })

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {
        etappes?.length ? (

          missiedagen.length ?
            (
              missiedagen.map(dag => {
                return (
                  <div className="ms-3 pb-3" key={dag.toString()}>
                    <Alert variant='success'>
                      {DateToDDMMYYYY(dag)}
                    </Alert>
                    <div className="ms-3">
                      <ListGroup key={dag.toString()}>
                        {
                          etappes.filter((etappe) => { return CompareDates(dag, etappe.startDatum) }).map((et) => {
                            return <ListGroupItem key={et.id}>{et.titel} | {GetTijdFromDate(et.startDatum)}| {GetTijdFromDate(et.eindDatum)}</ListGroupItem>
                          })
                        }
                      </ListGroup>
                    </div>

                  </div>

                )
              })
            ) : ('Geen missiedagen')

        ) : (<p>geen data</p>)
      }
    </ErrorBoundary>

  )
}

export default EtappeOverzicht