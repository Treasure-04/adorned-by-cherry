import emailjs from "@emailjs/browser";

const PUBLIC_KEY = "oRIEdqHI_-i5zOHtr";
const SERVICE_ID = "service_83s1rw5";
const RECEIVED_TEMPLATE_ID = "template_qk13pdo";
const CONFIRMED_TEMPLATE_ID = "template_fb96pft";

function formatDate(isoDate) {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function send(templateId, booking) {
  return emailjs.send(
    SERVICE_ID,
    templateId,
    {
      to_name: booking.name,
      to_email: booking.email,
      piercing: booking.piercing,
      date: formatDate(booking.date),
      time: booking.time,
    },
    { publicKey: PUBLIC_KEY }
  );
}

export const sendBookingReceived = (booking) => send(RECEIVED_TEMPLATE_ID, booking);
export const sendBookingConfirmed = (booking) => send(CONFIRMED_TEMPLATE_ID, booking);