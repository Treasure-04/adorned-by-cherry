import emailjs from "@emailjs/browser";

const PUBLIC_KEY = "oRIEdqHI_-i5zOHtr";
const SERVICE_ID = "service_83s1rw5";
const TEMPLATE_ID = "template_qk13pdo";
const ALERT_EMAIL = "treasuredelight18@gmail.com";

const SIGN_OFF = ["With love,", "Adorned by Cherry", "11 Aganorlu Street, Ada George", "09039876591"].join("\n");

function formatDate(isoDate) {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function send(toEmail, subject, message) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    { to_email: toEmail, subject: subject, message: message },
    { publicKey: PUBLIC_KEY }
  );
}

export const sendBookingReceived = (b) =>
  send(
    b.email,
    "We've received your booking request - Adorned by Cherry",
    [
      "Hello " + b.name + ",",
      "",
      "Thank you for choosing Adorned by Cherry. We've received your booking request:",
      "",
      "Piercing: " + b.piercing,
      "Date: " + formatDate(b.date),
      "Time: " + b.time,
      "",
      "Your appointment is not confirmed yet. We'll review your request and email you again as soon as it is confirmed.",
      "",
      SIGN_OFF,
    ].join("\n")
  );

export const sendBookingConfirmed = (b) =>
  send(
    b.email,
    "Your appointment is confirmed - Adorned by Cherry",
    [
      "Hello " + b.name + ",",
      "",
      "Good news! Your appointment at Adorned by Cherry has been accepted and scheduled.",
      "",
      "Piercing: " + b.piercing,
      "Date: " + formatDate(b.date),
      "Time: " + b.time,
      "",
      "A small request to help your visit go smoothly: please arrive on time. If you are running late or need to reschedule, let us know as early as you can on 09039876591 so we can plan around you.",
      "",
      "We can't wait to adorn you.",
      "",
      SIGN_OFF,
    ].join("\n")
  );

export const sendNewBookingAlert = (b) =>
  send(
    ALERT_EMAIL,
    "New booking request: " + b.name + " - " + b.piercing,
    [
      "You have a new booking request on the website.",
      "",
      "Name: " + b.name,
      "Phone: " + b.phone,
      "Email: " + b.email,
      "Piercing: " + b.piercing,
      "Date: " + formatDate(b.date),
      "Time: " + b.time,
      "Notes: " + (b.notes || "None"),
      "",
      "Open the admin dashboard to confirm or decline it:",
      window.location.origin + "/admin",
    ].join("\n")
  );