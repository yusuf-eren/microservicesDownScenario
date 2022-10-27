import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body.event;
  if (event === "ReservationPending") {
    const reservation = req.body.reservation;

    for (let i = 0; i < events.length; i++) {
      if (
        events[i].reservation.showId === reservation.showId &&
        events[i].reservation.seatId === reservation.seatId
      ) {
        return res.json({
          message: "This ticket already bought by another user",
        });
      }
    }
    events.push({ event, reservation });
    console.log(events);
    try {
      return res.json({ status: "success" });
    } catch (err) {}
  }
  if (event === "ShowsStarted" && events.length > 0) {
    let eventsToSend = events.filter(
      (event) => event.event === "ReservationPending"
    );
    eventsToSend.forEach(async (event) => {
      await axios
        .post(
          `http://localhost:3002/bought/${event.reservation.showId}/${event.reservation.seatId}`
        )
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    });

    return res.json({ status: "ok" });
  }

  return res.json({ status: "none", message: "no event" });
});

app.listen(3000, console.log("event-bus 3000"));
