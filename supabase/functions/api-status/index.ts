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
    const googleMapsKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const smtpHost = Deno.env.get("SMTP_HOST");

    const googlePlacesStatus = googleMapsKey ? "Connected" : "Not Configured";
    const emailStatus =
      resendKey || (smtpHost && Deno.env.get("SMTP_USER"))
        ? "Connected"
        : "Not Configured";

    return new Response(
      JSON.stringify({
        googlePlacesAPI: googlePlacesStatus,
        emailAPI: emailStatus,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message || "Internal server error",
        googlePlacesAPI: "Not Configured",
        emailAPI: "Not Configured",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
