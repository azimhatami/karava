import React from 'react';

const TextField = ({ label, name, register, type='text', required, validationSchema, errors }) => {
    return (
        <div className='space-y-3'> 
            <label htmlFor={name} className='block mt-2 text-secondary-700'>{label} { required && <span className='text-error'>*</span>}</label>
            <input
                {...register(name, validationSchema)}
                id={name}
                type={type}
                className='textField_input'
                autoComplete='off'
            />
            {errors && errors[name] && <span className='text-error block text-sm mt-2'>{errors[name]?.message}</span>}
        </div>
  )
};

export default TextField
