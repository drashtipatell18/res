import React from 'react'

export default function Btn() {
  return (
   <button className='p-2 m-5 position-absolute top-50 start-50 translate-middle fs-4' onClick={()=>{throw new Error("This is Your first error!")}}>Break the world</button>
  )
}
