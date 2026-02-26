import React, { useState ,useEffect} from 'react';
import apiService from '../services/api';


const Avatar = () => {

    const [imageSrc, setImageSrc] = useState('')
    const imageUrl = '/imagetest'

    useEffect(() => {
        const fetchAvatar = async () => {
            const avatarUrl = await apiService.get(imageUrl);
            console.log('avatarUrl:', avatarUrl);

            if (avatarUrl.image) {
                setImageSrc(avatarUrl.image);
            }
            console.log('imageSrc:', imageSrc);
        }
        fetchAvatar();
    }, [])


    return (
        <>
            <img src={imageSrc} alt="用户头像" size='sm' shape='circle' />
        </>
    )
}

export default Avatar;
