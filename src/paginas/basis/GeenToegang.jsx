import useAuth from "../../hooks/useAuth"

const GeenToegang = () => {
  const { auth } = useAuth();
  return (
    <>
      <div className="alert alert-danger">
        U hebt geen toegang tot deze pagina
      </div>
    </>
  )
}

export default GeenToegang