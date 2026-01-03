import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request, response) {
  // 1. Security Check: Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Get the email from the frontend request
  const { email } = request.body;

  try {
    // 3. Send the email using your Custom HTML
    const { data, error } = await resend.emails.send({
      // FIXED: 'noreply' is the standard spelling. 
      // Ensure 'prudhvirajchalapaka.in' is Verified in Resend.
      from: 'Prudhvi Raj <noreply@prudhvirajchalapaka.in>',
      
      to: [email],
      subject: 'Welcome to the Newsletter!',
      
      // 4. YOUR TEMPLATE CODE IS BELOW
      html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="width=device-width" name="viewport" />
    <link rel="preload" as="image" href="https://resend-attachments.s3.amazonaws.com/9PceE2HzJsOXnW8" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection" />
  </head>
  <body>
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0" data-skip-in-text="true">
      Discover my latest projects and publications in robotics and technology
      <div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ </div>
    </div>
    <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
      <tbody>
        <tr>
          <td>
            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;font-size:1.0769230769230769em;min-height:100%;line-height:155%">
              <tbody>
                <tr>
                  <td>
                    <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="align:left;width:100%;padding-left:0px;padding-right:0px;line-height:155%;max-width:600px;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif">
                      <tbody>
                        <tr>
                          <td>
                            <h1 style="margin:0;padding:0;font-size:2.25em;line-height:1.44em;padding-top:0.389em;font-weight:600;text-align:center">
                              <span style="color:#FFA500">
                                <em>
                                  <strong>I AM PRUDHVI RAJ</strong>
                                </em>
                              </span>
                            </h1>
                            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tbody style="width:100%">
                                <tr style="width:100%">
                                  <td align="center" data-id="__react-email-column">
                                    <img alt="A smiling young man in a brown jacket and white shirt against a neutral background." height="347" src="https://resend-attachments.s3.amazonaws.com/9PceE2HzJsOXnW8" style="display:block;outline:none;border:none;text-decoration:none;max-width:100%;border-radius:8px" width="345" />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <hr class="divider" style="width:100%;border:none;border-top:1px solid #eaeaea;padding-bottom:1em;border-width:2px" />
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <span>Thanks for subscribing to my newsletter, This newsletter will update you with my latest Projects and Publication i have done. hope you enjoy learning new things. Lets Contribute a meaningful to the Society through Robotics And Its technologies</span>
                            </p>
                            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" class="node-footer" style="font-size:0.8em">
                              <tbody>
                                <tr>
                                  <td>
                                    <hr class="divider" style="width:100%;border:none;border-top:1px solid #eaeaea;padding-bottom:1em;border-width:2px" />
                                    <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                                      <span>You are receiving this email because you opted in via our site.</span>
                                      <br />
                                      <br />
                                      <span>Want to change how you receive these emails?</span>
                                      <br />
                                      <span>You can </span>
                                      <span>
                                        <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" rel="noopener noreferrer nofollow" ses:no-track="true" style="color:#0670DB;text-decoration-line:none;text-decoration:underline" target="_blank">unsubscribe from this list</a>
                                      </span>
                                      <span>.</span>
                                    </p>
                                    <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                                      <span>Prudhvi Raj Chalapaka</span>
                                      <br />
                                      <span>Andhra Pradesh, INDIA</span>
                                      <br />
                                      <span>me@prudhvirajchalapaka.in</span>
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <br />
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return response.status(400).json({ error: error.message });
    }

    return response.status(200).json({ message: 'Email sent successfully', data });

  } catch (error) {
    console.error("Server Error:", error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
