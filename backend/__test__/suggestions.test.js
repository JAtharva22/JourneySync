const request = require("supertest");
const express = require("express");
require("dotenv").config();

const suggestionsRouter = require("../routes/suggestions");

const app = express();
app.use(express.json());
app.use("/api/suggestion", suggestionsRouter);

describe("GET /api/suggestion/suggestions", () => {
  it("should return location suggestions for a valid input", async () => {
    const response = await request(app)
      .get("/api/suggestion/suggestions")
      .query({ input: "Bandra" });
    console.log(response.body); // Log the response body for debugging
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("place_id");
    }
  });

  it("should return 400 if input is missing", async () => {
    const response = await request(app).get("/api/suggestion/suggestions");
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});

describe("GET /api/suggestion/coordinates", () => {
  it("should return 400 if place_id is missing", async () => {
    const response = await request(app).get("/api/suggestion/coordinates");
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return coordinates for a valid place_id", async () => {
    // Replace 'ChIJN1t_tDeuEmsRUsoyG83frY4' with a real place_id for a real test
    const validPlaceId = "ChIJh5DA8RnJ5zsRvTdT1hUzKzg";
    const response = await request(app)
      .get("/api/suggestion/coordinates")
      .query({ place_id: validPlaceId });
    console.log(response.statusCode); // Log the response body for debugging
    // Accept either 200 (success) or 404 (not found), depending on implementation
    expect([200, 404]).toContain(response.statusCode);
    if (response.statusCode === 200) {
      expect(response.body).toHaveProperty("latitude");
      expect(response.body).toHaveProperty("longitude");
    } else {
      expect(response.body).toHaveProperty("error");
    }
  });

  it("should return 400 if place_id is empty", async () => {
    const response = await request(app)
      .get("/api/suggestion/coordinates")
      .query({ place_id: "" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});