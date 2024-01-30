export const CheckCurrentUser = (users, currentUser, setIsOrganisator, setIsDeelnemer)=>{
    users.forEach(u => {
        if (currentUser.id === u.id) {
          setIsOrganisator(u.isOrganisator)
          setIsDeelnemer(u.isDeelnemer)
          return
        }
        return
      })


    }