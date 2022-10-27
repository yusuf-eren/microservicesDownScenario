import express from "express";
import axios from "axios";

const app = express();

app.post("/buy-ticket/:showId/:seatId", async (req, res) => {
  const { showId, seatId } = req.params;
  try {
    // Act like some payment logic is going...
    let response = await axios
      .post(`http://localhost:3002/bought/${showId}/${seatId}`)
      .then((data) => {
        console.log(data.data);
      })
      .catch(async (err) => {
        if (err.code === "ECONNREFUSED") {
          console.log("Handling by event-bus...");
          await axios.post("http://localhost:3000/events", {
            event: "ReservationPending",
            reservation: { showId, seatId },
          });
          return res.json({
            status: "success",
            message: "service is down. but event-bus handled the request",
            data: {
              showId,
              seatId,
            },
          });
        }
        return res.json({ status: "fail", message: err.message });
      });
    res.json({ status: "success" });
  } catch (err) {}
});

app.listen(3001, console.log("checkout 3001"));
