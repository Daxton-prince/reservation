import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Only POST requests allowed" });
    }

    const { name, email, phone, date, time, guests, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.RESTAURANT_EMAIL,
                pass: process.env.RESTAURANT_EMAIL_PASS
            }
        });

        // Email to restaurant
        const restaurantMail = {
            from: `"Order System" <${process.env.RESTAURANT_EMAIL}>`,
            to: process.env.RESTAURANT_EMAIL,
            subject: `New Order From ${name}`,
            html: `
                <h2>New Reservation / Order Received</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Guests:</strong> ${guests}</p>
                <p><strong>Order Details:</strong><br>${message}</p>
            `
        };

        await transporter.sendMail(restaurantMail);

        // Email to customer
        const customerMail = {
            from: `"${process.env.RESTAURANT_NAME}" <${process.env.RESTAURANT_EMAIL}>`,
            to: email,
            subject: "Your Order Has Been Received",
            html: `
                <p>Dear <strong>${name}</strong>,</p>
                <p>Your order/reservation has been received successfully.</p>
                <h3>Your Details:</h3>
                <p>${message}</p>
                <p>We are processing it and will contact you shortly.</p>
                <p>Thank you for trusting our service!</p>
                <br>
                <p><strong>${process.env.RESTAURANT_NAME}</strong></p>
            `
        };

        await transporter.sendMail(customerMail);

        res.status(200).json({ message: "Order sent successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send order." });
    }
}
