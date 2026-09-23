const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { recipient, subject, message, buyer_name } = body;

    if (!recipient || !subject || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          status: "failed",
          error: "Recipient, subject, and message are required.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = Deno.env.get("SMTP_PORT");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");
    const fromEmail = Deno.env.get("FROM_EMAIL");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const emailProviderConfigured =
      (smtpHost && smtpUser && smtpPass) || resendApiKey;

    if (!emailProviderConfigured) {
      return new Response(
        JSON.stringify({
          success: false,
          status: "failed",
          error: "Email provider not configured.",
          notConfigured: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // If Resend API key is configured, use Resend
    if (resendApiKey) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail || "outreach@globalbuyerfinder.com",
          to: [recipient],
          subject: subject,
          text: message,
        }),
      });

      if (!emailResponse.ok) {
        const errText = await emailResponse.text();
        return new Response(
          JSON.stringify({
            success: false,
            status: "failed",
            error: `Email sending failed: ${errText}`,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const emailData = await emailResponse.json();

      return new Response(
        JSON.stringify({
          success: true,
          status: "sent",
          messageId: emailData.id,
          buyer_name: buyer_name || "",
          recipient,
          subject,
          message,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // SMTP fallback — use Deno native (basic SMTP not available in Deno core)
    // For production, recommend Resend or similar API-based provider
    return new Response(
      JSON.stringify({
        success: false,
        status: "failed",
        error: "SMTP configuration detected but not supported in edge runtime. Use RESEND_API_KEY instead.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        status: "failed",
        error: err.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
