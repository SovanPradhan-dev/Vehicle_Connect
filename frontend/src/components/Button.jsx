import React from 'react'

const Button = (props) => {
  return (
    <button className={`h-8 px-4 ${props.color || 'bg-amber-500'} rounded m-1 text-white`} onClick={()=>props.func()}>{props.name}</button>
  )
}

export default Button