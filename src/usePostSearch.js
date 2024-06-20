import React, { useEffect } from 'react'
import axios from 'axios';

export default function usePostSearch(query,pageNumber) {
    useEffect(() => {
        axios({
            method: 'GET',
            url: 'http://localhost:3000/',
            params:{q:query,page:pageNumber}
        }).then((res) => {
            console.log(res.data);
      })
    },[query,pageNumber])
    return null;
}
