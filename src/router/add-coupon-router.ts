import AddCouponValidator from "../validator/add-coupon-validator";
import AddCouponController from "../controller/add-coupon-controller";

export default async function addCouponRouter(req, res) {
  const { createdBy, title } = req.body;
  const validator = new AddCouponValidator();
  const result = validator.validateAddCouponRequest(createdBy, title);

  if (result !== "") return res.status(400).send(result);

  try {
    const controller = new AddCouponController();
    const coupon = await controller.addCoupon(createdBy, title);
    return res.status(201).send(JSON.stringify(coupon.toObject()));
  } catch (ex) {
    console.log(ex);
    return res.status(503).send("しばらく経ってからやり直してください");
  }
}
