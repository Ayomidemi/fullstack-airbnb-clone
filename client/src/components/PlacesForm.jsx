import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import AccountNav from "./AccountNav";
import Perks from "./Perks";
import PhotosUploader from "./PhotosUploader";

const PlacesForm = () => {
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);
  const [details, setDetails] = useState({
    title: "",
    address: "",
    photos: [],
    description: "",
    perks: [],
    extraInfo: "",
    checkIn: "",
    checkOut: "",
    maxGuests: 1,
    price: 100,
  });

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;

      setDetails(data);
    });
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev) {
    ev.preventDefault();

    if (id) {
      // update
      await axios.put("/places", {
        id,
        ...details,
      });
      setRedirect(true);
    } else {
      // new place
      await axios.post("/places", details);
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  console.log(details);

  return (
    <div>
      <AccountNav />

      <form onSubmit={savePlace}>
        {preInput(
          "Title",
          "Title for your place. should be short and catchy as in advertisement"
        )}
        <input
          type="text"
          value={details.title}
          onChange={(ev) => setDetails({ ...details, title: ev.target.value })}
          placeholder="title, for example: My lovely apt"
        />

        {preInput("Address", "Address to this place")}
        <input
          type="text"
          value={details.address}
          onChange={(ev) =>
            setDetails({ ...details, address: ev.target.value })
          }
          placeholder="address"
        />

        {preInput("Photos", "more = better")}
        <PhotosUploader
          addedPhotos={details?.photos}
          onChange={(newPerks) =>
            setDetails((prevDetails) => ({ ...prevDetails, photos: newPerks }))
          }
        />

        {preInput("Description", "description of the place")}
        <textarea
          value={details.description}
          onChange={(ev) =>
            setDetails({ ...details, description: ev.target.value })
          }
        />

        {preInput("Perks", "select all the perks of your place")}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks
            selected={details.perks}
            onChange={(newPerks) =>
              setDetails((prevDetails) => ({ ...prevDetails, perks: newPerks }))
            }
          />
        </div>

        {preInput("Extra info", "house rules, etc")}
        <textarea
          value={details.extraInfo}
          onChange={(ev) =>
            setDetails({ ...details, extraInfo: ev.target.value })
          }
        />

        {preInput(
          "Check in&out times",
          "add check in and out times, remember to have some time window for cleaning the room between guests"
        )}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input
              type="text"
              value={details.checkIn}
              onChange={(ev) =>
                setDetails({ ...details, checkIn: ev.target.value })
              }
              placeholder="14"
            />
          </div>

          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input
              type="text"
              value={details.checkOut}
              onChange={(ev) =>
                setDetails({ ...details, checkOut: ev.target.value })
              }
              placeholder="11"
            />
          </div>

          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input
              type="number"
              value={details.maxGuests}
              onChange={(ev) =>
                setDetails({ ...details, maxGuests: ev.target.value })
              }
            />
          </div>

          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              value={details.price}
              onChange={(ev) =>
                setDetails({ ...details, price: ev.target.value })
              }
            />
          </div>
        </div>

        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
};

export default PlacesForm;
