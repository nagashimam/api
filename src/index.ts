import addCouponRouter from "./router/add-coupon-router";

const express = require("express");
const app = express();
app.use(express.json());

app.post("/coupons", (req, res) => addCouponRouter(req, res));
app.listen(3000, () => console.log("Example app listening on port 3000!"));
