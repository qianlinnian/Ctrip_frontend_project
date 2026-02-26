import {Navigate} from 'react-router-dom'


const PrivateRoute = ({user, children, allowRoles}) => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token) {
        console.log('No token found, redirecting to login page...')
        return <Navigate to='/login' />
    }

    if (allowRoles && !allowRoles.includes(role)) {
        if(role === 'admin') {
            console.log('Role not allowed, redirecting to home page...')
            return <Navigate to='/admin/dashboard' />
        }
        else if(role === 'merchant')
            console.log('Role not allowed, redirecting to home page...')
            return <Navigate to='/merchant/dashboard' />
    }

    return children
}
export default PrivateRoute
