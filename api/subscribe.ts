import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = request.body;

  try {
    // 1. Send the email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Newsletter <hello@yourdomain.com>', // CHANGE THIS to your verified domain email
      to: [email],
      subject: 'Welcome to the Newsletter!',
      html: '<h1>Welcome!</h1><p>Thanks for subscribing to our newsletter.</p>',
    });

    if (error) {
      return response.status(400).json({ error });
    }

    return response.status(200).json({ message: 'Email sent successfully', data });
  } catch (error) {
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
