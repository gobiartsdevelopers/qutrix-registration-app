import React from "react";
import { useForm, Controller } from "react-hook-form";
import colleges from "../data/colleges.json";
import departments from "../data/departments.json";
import events from "../data/events.json";
import axios from "axios";

function Register() {
  const { control, handleSubmit, errors } = useForm();

  const onSubmit = async (studentData) => {
    // const { collegeOption, departmentOption, eventOption, } = data;
    // console.log("collegeOption:", collegeOption);
    // console.log("departmentOption:", departmentOption);
    // console.log("eventOption:", eventOption);
    const { data } = await axios.post(
      "http://localhost:3500/api/register",
      studentData
    );
    console.log({ data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="collegeOption">Select College</label>
        <Controller
          name="collegeOption"
          control={control}
          defaultValue=""
          rules={{ required: "Please select an college" }}
          render={({ field }) => (
            <select {...field}>
              <option value="" disabled>
                Select an college
              </option>
              {colleges.map((college) => (
                <option value={college.name} key={college.name}>
                  {college.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors?.collegeOption && (
          <p className="error">{errors.collegeOption.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="eventOption">Select Event</label>
        <Controller
          name="eventOption"
          control={control}
          defaultValue=""
          rules={{ required: "Please select an event" }}
          render={({ field }) => (
            <select {...field}>
              <option value="" disabled>
                Select an event
              </option>
              {events.map((event) => (
                <option value={event.name} key={event.name}>
                  {event.name.toUpperCase()}
                </option>
              ))}
            </select>
          )}
        />
        {errors?.eventOption && (
          <p className="error">{errors.eventOption.message}</p>
        )}
      </div>
      {/*  */}
      <div>
        <label htmlFor="departmentOption">Select Department</label>
        <Controller
          name="departmentOption"
          control={control}
          defaultValue=""
          rules={{ required: "Please select an department" }}
          render={({ field }) => (
            <select {...field}>
              <option value="" disabled>
                Select an department
              </option>
              {departments.map((department) => (
                <option value={department.name} key={department.name}>
                  {department.name.toUpperCase()}
                </option>
              ))}
            </select>
          )}
        />
        {errors?.departmentOption && (
          <p className="error">{errors.departmentOption.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="name">Name</label>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: "This field is required" }}
          render={({ field }) => <input type="text" {...field} />}
        />
        {errors?.name && <p className="error">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="rollNumber">Roll Number</label>
        <Controller
          name="rollNumber"
          control={control}
          defaultValue=""
          rules={{ required: "This field is required" }}
          render={({ field }) => <input type="text" {...field} />}
        />
        {errors?.rollNumber && (
          <p className="error">{errors.rollNumber.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{ required: "This field is required" }}
          render={({ field }) => <input type="text" {...field} />}
        />
        {errors?.email && <p className="error">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="mobile">Mobile</label>
        <Controller
          name="mobile"
          control={control}
          defaultValue=""
          rules={{ required: "This field is required" }}
          render={({ field }) => <input type="text" {...field} />}
        />
        {errors?.mobile && <p className="error">{errors.mobile.message}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default Register;
