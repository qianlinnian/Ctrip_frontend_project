import {Navigate} from 'react-router-dom'


const PrivateRoute = ({user, children}) => {
    const token = localStorage.getItem('token')
    if (!token) {
        console.log('No token found, redirecting to login page...')
        return <Navigate to='/login' />
    }

    return children
}
export default PrivateRoute
