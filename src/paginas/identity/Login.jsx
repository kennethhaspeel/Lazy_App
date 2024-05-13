import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios, {axiosUrls} from '../../api/axios';
import { Alert } from 'react-bootstrap';


const Login = () => {
    const { setAuth, persist, setPersist } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [paswoord, setPaswoord] = useState("");
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, paswoord])

    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {

            const response = await axios.post(axiosUrls('login'),
                JSON.stringify({ username, paswoord }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            //console.log(response.data);
            const accessToken = response?.data?.accessToken;
            const rollen = response?.data?.rollen;
            const user = {
                naam: response?.data?.naam,
                voornaam: response?.data?.voornaam,
                volledigenaam: response?.data?.volledigenaam,
                username: username,
                id: response?.data?.id
            }
            //console.log(user)
            setAuth({ user, rollen, accessToken });
            sessionStorage.setItem('at',response.data.accessToken)
            localStorage.setItem('rt', response?.data?.refreshtoken)
            setUsername('');
            setPaswoord('');
            setLoading(false)
            navigate(from, { replace: true });
        } catch (err) {
            console.log(err)
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg(err.response.data);
            }
            errRef.current.focus();
            setLoading(false)
        }
    }
    return (
        <>
            <h1>Log In</h1>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            
            {
                loading ? (
                    <Alert variant='info'>Even geduld... U wordt ingelogd</Alert>
                ) :
                    (
                        <section>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Uw emaildres</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="username"
                                        autoComplete="off"
                                        ref={userRef}
                                        onChange={(e) => setUsername(e.target.value)}
                                        value={username}
                                        required
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="paswoord" className="form-label">Uw paswoord</label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        id="paswoord"
                                        autoComplete="off"
                                        onChange={(e) => setPaswoord(e.target.value)}
                                        value={paswoord}
                                        required
                                    />
                                </div>
                                <div className='mb-3'>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="chkOnthouMij"
                                            checked={persist}
                                            onChange={togglePersist}
                                        />
                                        <label className="form-check-label" htmlFor="chkOnthouMij">
                                            Onthou mij
                                        </label>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-info mt-3">Inloggen</button>
                            </form>
                            <p>Nog niet geregistreerd? Registreer <Link to='/identity/registreer'>HIER</Link></p>
                            <p>Paswoord vergeten? <Link to='/identity/paswoordvergeten'>Klik hier</Link> </p>
                        </section>

                    )
            }

        </>
    );
};

export default Login;
