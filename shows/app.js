import express from "express";
import axios from "axios";

const app = express();

const shows = {
  1: {
    show: "Lacrimosa",
    emptySeats: [1, 12, 20, 37, 54],
  },
  2: {
    show: "Romeo & Juliet",
    emptySeats: [7, 8, 12, 29],
  },
};

app.post("/bought/:showId/:seatId", async (req, res) => {
  const { showId, seatId } = req.params;
  const show = shows[showId];
  let selectedSeat = show.emptySeats.find((seat) => seat == seatId);
  if (!selectedSeat) {
    return res
      .status(404)
      .json({ status: "fail", message: "seat is not empty" });
  }

  // REMOVE THE EMPTY SEAT IF CHECKOUT IS OKAY
  let index = show.emptySeats.indexOf(parseInt(seatId));
  if (index != -1) {
    show.emptySeats.splice(index, 1);
  }

  try {
    res.json({ emptySeats: show.emptySeats });
  } catch (err) {}
});

app.listen(3002, console.log("shows 3002"));

await axios.post("http://localhost:3000/events", {
  event: "ShowsStarted",
}).then((data)=>{
  console.log(data.data)
}).catch((err)=> console.log(err));