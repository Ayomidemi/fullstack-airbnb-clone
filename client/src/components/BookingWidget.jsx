/* eslint-disable react/prop-types */

import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";

import { UserContext } from "./UserContext";

export default function BookingWidget({ place }) {
  const [details, setDetails] = useState({
    checkIn: "",
    checkOut: "",
    numberOfGuests: 1,
    name: "",
    phone: "",
  });
  const [redirect, setRedirect] = useState("");

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setDetails({
        ...details,
        name: user?.name || "",
      });
    }
  }, [details, user]);

  let numberOfNights = 0;
  if (details?.checkIn && details?.checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(details?.checkOut),
      new Date(details?.checkIn)
    );
  }

  async function bookThisPlace() {
    const response = await axios.post("/bookings", {
      ...details,
      place: place._id,
      price: numberOfNights * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input
              type="date"
              value={details?.checkIn}
              onChange={(ev) =>
                setDetails({ ...details, checkIn: ev.target.value })
              }
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input
              type="date"
              value={details?.checkOut}
              onChange={(ev) =>
                setDetails({ ...details, checkOut: ev.target.value })
              }
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input
            type="number"
            value={details?.numberOfGuests}
            onChange={(ev) =>
              setDetails({ ...details, numberOfGuests: ev.target.value })
            }
          />
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={details?.name}
              onChange={(ev) =>
                setDetails({ ...details, name: ev.target.value })
              }
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={details?.phone}
              onChange={(ev) =>
                setDetails({ ...details, phone: ev.target.value })
              }
            />
          </div>
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book this place
        {numberOfNights > 0 && <span> ${numberOfNights * place.price}</span>}
      </button>
    </div>
  );
}
