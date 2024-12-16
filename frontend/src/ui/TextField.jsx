import React from 'react';

const TextField = ({label, name, value, onChange}) => {
    return (
        <div className='space-y-3'> 
            <label htmlFor={name} className='block'>{label}</label>
            <input
                value={value}
                onChange={onChange}
                id={name}
                name={name}
                type='text'
                className='textField_input'
                autoComplete='off'
            />
        </div>
  )
};

export default TextField