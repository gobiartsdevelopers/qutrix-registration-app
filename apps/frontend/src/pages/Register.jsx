import { useForm, Controller } from 'react-hook-form';
import colleges from '../data/colleges.json';
import departments from '../data/departments.json';
import events from '../data/events.json';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

function Register() {
    const [loading, setLoading] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors, isDirty, isValid },
    } = useForm();

    const onSubmit = async (studentData) => {
        if (isDirty && isValid) {
            setLoading(true);
        }
        toast.loading('Adding Student details ⌛', { id: '1' });
        try {
            const result = await axios.post(
                'http://localhost:3500/api/register',
                studentData
            );
            console.log({ result });
            toast.success(result?.data?.message, { id: '1' });
        } catch (error) {
            console.log({ error });
            let message =
                error?.response?.data.message ??
                'Error occurs in student details adding 🥲';
            console.log({ message });
            toast.error(message, { id: '1' });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor='college'>Select College</label>
                <Controller
                    name='college'
                    control={control}
                    defaultValue=''
                    rules={{ required: 'Please select an college' }}
                    render={({ field }) => (
                        <select {...field}>
                            <option
                                value=''
                                disabled
                            >
                                Select an college
                            </option>
                            {colleges.map((college) => (
                                <option
                                    value={college.name}
                                    key={college.name}
                                >
                                    {college.name}
                                </option>
                            ))}
                        </select>
                    )}
                />
                {errors?.college && (
                    <p className='error'>{errors.college.message}</p>
                )}
            </div>
            <div>
                <label htmlFor='event'>Select Event</label>
                <Controller
                    name='event'
                    control={control}
                    defaultValue=''
                    rules={{ required: 'Please select an event' }}
                    render={({ field }) => (
                        <select {...field}>
                            <option
                                value=''
                                disabled
                            >
                                Select an event
                            </option>
                            {events.map((event) => (
                                <option
                                    value={event.name}
                                    key={event.name}
                                >
                                    {event.name.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    )}
                />
                {errors?.event && (
                    <p className='error'>{errors.event.message}</p>
                )}
            </div>
            {/*  */}
            <div>
                <label htmlFor='department'>Select Department</label>
                <Controller
                    name='department'
                    control={control}
                    defaultValue=''
                    rules={{ required: 'Please select an department' }}
                    render={({ field }) => (
                        <select {...field}>
                            <option
                                value=''
                                disabled
                            >
                                Select an department
                            </option>
                            {departments.map((department) => (
                                <option
                                    value={department.name}
                                    key={department.name}
                                >
                                    {department.name.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    )}
                />
                {errors?.department && (
                    <p className='error'>{errors.department.message}</p>
                )}
            </div>
            <div>
                <label htmlFor='name'>Name</label>
                <Controller
                    name='name'
                    control={control}
                    defaultValue=''
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                        <input
                            type='text'
                            {...field}
                        />
                    )}
                />
                {errors?.name && <p className='error'>{errors.name.message}</p>}
            </div>
            <div>
                <label htmlFor='rollNumber'>Roll Number</label>
                <Controller
                    name='rollNumber'
                    control={control}
                    defaultValue=''
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                        <input
                            type='text'
                            {...field}
                        />
                    )}
                />
                {errors?.rollNumber && (
                    <p className='error'>{errors.rollNumber.message}</p>
                )}
            </div>

            <div>
                <label htmlFor='email'>Email</label>
                <Controller
                    name='email'
                    control={control}
                    defaultValue=''
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                        <input
                            type='text'
                            {...field}
                        />
                    )}
                />
                {errors?.email && (
                    <p className='error'>{errors.email.message}</p>
                )}
            </div>
            <div>
                <label htmlFor='mobile'>Mobile</label>
                <Controller
                    name='mobile'
                    control={control}
                    defaultValue=''
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                        <input
                            type='text'
                            {...field}
                        />
                    )}
                />
                {errors?.mobile && (
                    <p className='error'>{errors.mobile.message}</p>
                )}
            </div>

            <button type='submit'>Submit</button>
        </form>
    );
}

export default Register;
