import { Resend } from 'resend';

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request, response) {
  // 1. Security Check: Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Get the email from the frontend request
  const { email } = request.body;

  try {
    // 3. Send the email
    const { data, error } = await resend.emails.send({
      // FIXED: 'noreplay' -> 'noreply' (Standard spelling)
      from: 'Prudhvi Raj <noreply@prudhvirajchalapaka.in>',
      
      to: [email],
      subject: 'Welcome to the Newsletter!',
      
      // IMPORTANT: The Resend API does not accept "template_id" for single emails.
      // You must paste the HTML code below.
      // Go to Resend Dashboard -> Templates -> "welcome_newsletter" -> "Export" or "Copy HTML"
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1>Welcome to My Community!</h1>
          <p>Hi there,</p>
          <p>Thank you so much for subscribing to my newsletter. I am excited to share my robotics and automation journey with you.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>Prudhvi Raj</strong></p>
        </div>
      `,
    });

    // 4. Handle Resend Errors (e.g., Domain not verified)
    if (error) {
      console.error("Resend API Error:", error);
      return response.status(400).json({ error: error.message });
    }

    // 5. Success!
    return response.status(200).json({ message: 'Email sent successfully', data });

  } catch (error) {
    // 6. Handle Server Errors (e.g., Network issues)
    console.error("Server Error:", error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
