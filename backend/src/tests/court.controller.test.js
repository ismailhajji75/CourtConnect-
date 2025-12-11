
import test from "node:test";
import assert from "node:assert/strict";


import { createBooking } from "../controllers/court.controller.js";
import { bookings } from "../data/mock.js";

const createMockRes = () => {
  const res = {};
  res.statusCode = 200;
  res.body = null;

  res.status = (code) => {
    res.statusCode = code;
    return res;
  };

  res.json = (payload) => {
    res.body = payload;
    return res;
  };

  return res;
};

// Sanity check: Futsal booking auto-creates 1h slot starting at startTime
test("createBooking creates 1-hour futsal booking and blocks overlap", () => {
  bookings.length = 0;

  const req = {
    user: {
      id: 10,
      username: "nabil",
      email: "nabil@aui.ma",
      role: "STUDENT",
    },
    body: {
      facilityId: "futsal",
      date: "2025-12-05",
      startTime: "16:00",
    },
  };

  const res = createMockRes();
  createBooking(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.booking.startTime, "16:00");
  assert.equal(res.body.booking.endTime, "17:00");

  // Overlap attempt should be rejected
  const overlapReq = {
    ...req,
    user: { ...req.user, id: 11, email: "second@aui.ma" },
    body: { ...req.body, startTime: "16:30" },
  };
  const overlapRes = createMockRes();
  createBooking(overlapReq, overlapRes);
  assert.equal(overlapRes.statusCode, 400);
});
