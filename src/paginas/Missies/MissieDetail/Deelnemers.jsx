import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../../api/axios";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faTrashCan,
  faPlus,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import SuspenseParagraaf from "../../../components/SuspenseParagraaf";
import { Row, Col, Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

const Deelnemers = ({
  missieid,
  currentUser,
  isOrganisator,
  setIsOrganisator,
  isDeelnemer,
  setIsDeelnemer,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [showModalSelectDeelnemer, setShowModalSelectDeelnemer] = useState(false);
  const [showModalSelectOrganisator, setShowModalSelectOrganisator] = useState(false);
  const {
    data: missiedeelnemers,
    isLoading: DeelnemersLoading,
    isError: DeelnemersError,
  } = useQuery({
    queryKey: ["missiedeelnemers", missieid],
    queryFn: async () => {
      const url = `${axiosUrls("GetMissieDeelnemers")}/${missieid}`;
      const response = await axiosPrivate.get(url);
      console.log(response.data)
      return response.data;
    },
  });

  const { mutate: setMissieDeelnemer, isLoading: LoadUpdateDeelnemer } =
    useMutation({
      mutationFn: async (deelnemer) => {
        return axiosPrivate.post(
          axiosUrls("UpdateMissieDeelnemer"),
          deelnemer
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["missiedeelnemers", missieid]);
      },
    });

  useEffect(() => {
    if (missiedeelnemers) {
      missiedeelnemers.forEach((u) => {
        if (currentUser.id === u.id) {
          setIsOrganisator(u.isOrganisator);
          setIsDeelnemer(u.isDeelnemer);
          return;
        }
        return;
      });
    }
  }, [missiedeelnemers]);

  const switchDeelnemer = (userId, naarDeelnemers, naarOrganisatoren) => {
    const user = missiedeelnemers.filter((el) => {
      return el.id === userId
    })[0]
    user.isDeelnemer = naarDeelnemers
    user.isOrganisator = naarOrganisatoren
    user.MissieId = missieid
    setMissieDeelnemer(user);
  };
  const handleCloseSelectDeelnemer = () => {
    setShowModalSelectDeelnemer(false);
  };
  const handleCloseSelectOrganisator = () => {
    setShowModalSelectOrganisator(false);
  };

  if (DeelnemersError) return <h1>{JSON.stringify(DeelnemersError)}</h1>;
  if (DeelnemersLoading) return <SuspenseParagraaf />;
  return (
    <>
      {missiedeelnemers?.length ? (
        <>
          <Row className="mb-3">
            <Col md={2} sm={12}>
              Organisatoren
              {isOrganisator ? (
                <Button
                  variant="info"
                  onClick={() => {
                    setShowModalSelectOrganisator(true);
                    console.log("geklikt");
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              ) : (
                ""
              )}
            </Col>
            <Col md={8} sm={12}>
              {missiedeelnemers
                .filter((u) => {
                  if (u.isOrganisator) {
                    return true;
                  } else {
                    return false;
                  }
                })
                .map((u) =>
                  isOrganisator &&
                    missiedeelnemers.filter((u) => {
                      if (u.isOrganisator) {
                        return true;
                      } else {
                        return false;
                      }
                    }).length > 1 ? (
                    <Button
                      key={u.id}
                      variant="info"
                      className="me-2 mb-2"
                      onClick={() => {
                        switchDeelnemer(u.id, true, false);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashCan} /> {u.volledigeNaam}
                    </Button>
                  ) : (
                    <Button
                      key={u.id}
                      variant="info"
                      className="me-2 mb-2"
                      disabled
                    >
                      {u.volledigeNaam}
                    </Button>
                  )
                )}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={2} sm={12}>
              Deelnemers
              {isOrganisator ? (
                <Button
                  variant="info"
                  onClick={() => {
                    setShowModalSelectDeelnemer(true);
                    console.log("geklikt");
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              ) : (
                ""
              )}
            </Col>
            <Col md={10} sm={12}>
              {missiedeelnemers
                .filter((u) => {
                  if (!u.isOrganisator && u.isDeelnemer) {
                    return true;
                  } else {
                    return false;
                  }
                })
                .map((u) =>
                  isOrganisator ? (
                    <Button
                      key={u.id}
                      variant="info"
                      className="me-2 mb-2"
                      onClick={() => {
                        switchDeelnemer(u.id, false, false);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashCan} /> {u.volledigeNaam}
                    </Button>
                  ) : (
                    <Button
                      key={u.id}
                      variant="info"
                      className="me-2 mb-2"
                      disabled
                    >
                      {u.volledigeNaam}
                    </Button>
                  )
                )}
            </Col>
          </Row>
          {!isOrganisator ? (
            isDeelnemer ? (
              <Row>
                <Col md={{ span: 8, offset: 2 }} sm={12}>
                  <Button
                    variant="danger"
                    onClick={() => {
                      switchDeelnemer(currentUser.id, false, false);
                    }}
                  >
                    Trek junder plan, ik doe nie mee
                  </Button>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col md={{ span: 8, offset: 2 }} sm={12}>
                  <Button
                    variant="success"
                    onClick={() => {
                      switchDeelnemer(currentUser.id, true);
                    }}
                  >
                    Ik doe mee
                  </Button>
                </Col>
              </Row>
            )
          ) : (
            ""
          )}
          <hr />
        </>
      ) : (
        <p>'Geen deelnemers'</p>
      )}
      <Modal
        show={showModalSelectDeelnemer}
        onHide={handleCloseSelectDeelnemer}
      >
        <Modal.Header closeButton>
          <Modal.Title>Deelnemer toevoegen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {missiedeelnemers.length &&
            missiedeelnemers.map((user) =>
              !user.isDeelnemer ? (
                <Row key={user.id}>
                  <Col className="d-grid gap-2 pb-2">
                    <Button
                      variant="success"
                      onClick={() => {
                        switchDeelnemer(user.id, true, false);
                      }}
                    >
                      <FontAwesomeIcon icon={faSquarePlus} />{" "}
                      {user.volledigeNaam}
                    </Button>
                  </Col>
                </Row>
              ) : (
                ""
              )
            )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSelectDeelnemer}>
            Sluit
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showModalSelectOrganisator}
        onHide={handleCloseSelectOrganisator}
      >
        <Modal.Header closeButton>
          <Modal.Title>Organisator toevoegen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {missiedeelnemers?.length ? (
            missiedeelnemers.map((user) =>
              !user.isOrganisator && user.isDeelnemer ? (
                <Row key={user.id}>
                  <Col className="d-grid gap-2 pb-2">
                    <Button
                      variant="success"
                      onClick={() => {
                        switchDeelnemer(user.id, true, true);
                      }}
                    >
                      <FontAwesomeIcon icon={faSquarePlus} />{" "}
                      {user.volledigeNaam}
                    </Button>
                  </Col>
                </Row>
              ) : (
                ""
              )
            )
          ) : (
            <p>
              Er moet eerst een deelnemer wordt toegevoegd om als organisator te
              kunnen worden aangeduid
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSelectOrganisator}>
            Sluit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Deelnemers;
