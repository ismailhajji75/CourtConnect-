
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

// hna unit test: Futsal booking > 1 hour should be rejected
test("createBooking rejects futsal bookings longer than 1 hour", () => {
  // hnaya we clear previous bookings
  bookings.length = 0;

  // Fake logged in STUDENT user b smyti ana hhh
  const req = {
    user: {
      id: 10,
      username: "nabil",
      email: "nabil@aui.ma",
      role: "STUDENT",
    },
    body: {
      facilityId: 1,          // 1 = Futsal Court 5v5 kayn f mock.js
      date: "2025-12-05",
      startTime: "16:00",
      endTime: "17:30",       // 1h30 should NOT be allowed
      withLight: true,
    },
  };

  const res = createMockRes();

  createBooking(req, res);

  // DEBUG: see what controller returned
  console.log("DEBUG RES:", res.statusCode, res.body);

  // We only require that it returns a 400 error with SOME error message
  assert.equal(res.statusCode, 400, "Expected status code 400 for invalid futsal duration");
  assert.ok(res.body, "Response body should not be empty");
  assert.ok(
    typeof res.body.error === "string",
    "Response should contain an 'error' string"
  );
});
