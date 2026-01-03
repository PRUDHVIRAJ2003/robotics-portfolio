import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: WelcomeEmailRequest = await req.json();
    
    console.log(`Sending welcome email to: ${email}`);

    const emailResponse = await resend.emails.send({
      from: "Prudhvi Raj <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to My Newsletter! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <tr>
              <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Welcome! 🚀</h1>
              </td>
            </tr>
            <tr>
              <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px;">
                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                  Thank you for subscribing to my newsletter! I'm thrilled to have you on board.
                </p>
                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                  You'll receive updates about:
                </p>
                <ul style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0 0 20px; padding-left: 20px;">
                  <li>New projects and innovations in robotics & automation</li>
                  <li>Research publications and findings</li>
                  <li>Industry insights and tech trends</li>
                </ul>
                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                  Stay tuned for exciting content coming your way!
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center">
                      <a href="https://prudhvirajchalapaka.in" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                        Visit My Portfolio
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                  Best regards,<br>
                  <strong style="color: #374151;">Prudhvi Raj Chalapaka</strong><br>
                  Robotics & Automation Engineer
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
