import { useEffect, createContext, useContext, useState } from 'react'
import { getCurrentUser } from '../lib/appwrite'

const GlobalContext = createContext()

export const useGlobalContext = () => useContext(GlobalContext)

 const GlobalProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getCurrentUser()
        .then(user => {
            if (user) {
                setIsLoggedIn(true)
                setUser(user)
            }else{
                setIsLoggedIn(false)
                setUser({})
            }
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setIsLoading(false)
        })
    }, [])

    return (
        <GlobalContext.Provider 
            value={{isLoggedIn, user, isLoading, setIsLoggedIn, setUser}}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
