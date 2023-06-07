import { request } from "express";
import mercadopago from "mercadopago";
import { HOST, MERCADOPAGO_API_KEY } from "../config.js";

export const createOrder = async (req, res) => {
  mercadopago.configure({
    access_token: MERCADOPAGO_API_KEY,
  });

  const result = await mercadopago.preferences.create({
    items: [
      {
        title: "laptop",
        unit_price: 500000,
        currency_id: "COP",
        quantity: 1,
      },
    ],
    back_urls: {
      success: `${HOST}/success`,
      failure: `${HOST}/failure`,
      pending: `${HOST}/pending`,
    },
    notification_url:
      "https://9ef0-2800-484-217c-8f71-a857-ba3b-1c74-3248.ngrok-free.app/webhook",
  });

  console.log(result);

  res.send(result.body);
};

export const receiveWebhook = async (req, res) => {
  const payment = req.query;
  try {
    if (payment.type === "payment") {
      const data = await mercadopago.payment.findById(payment["data.id"]);
      console.log(data);
    }
    res.send(204);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500).json({ error: error.message });
  }
};
