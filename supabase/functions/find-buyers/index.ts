const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PlaceResult {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  primaryTypeDisplayName?: { text?: string };
  types?: string[];
  internationalPhoneNumber?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
}

interface PlaceReview {
  text?: { text?: string };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      country = "United States",
      state = "",
      city = "",
      category = "Home Decor",
      keyword = "",
    } = body;

    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            "API not configured — add GOOGLE_MAPS_API_KEY in environment variables.",
          configured: false,
          buyers: [],
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build search text query
    const parts: string[] = [];
    if (keyword) parts.push(keyword);
    else if (category) parts.push(category);

    // Add category descriptor
    const categoryDesc = category.toLowerCase().includes("store")
      ? category
      : `${category} stores`;
    if (!keyword) {
      parts[0] = categoryDesc;
    } else {
      parts.push(categoryDesc);
    }

    const locationParts: string[] = [];
    if (city) locationParts.push(city);
    if (state) locationParts.push(state);
    if (country) locationParts.push(country);
    const locationStr = locationParts.join(", ");

    const searchText = `${parts.join(" ")} in ${locationStr}`;

    // Use Google Places API (New) - Text Search
    const searchResponse = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.primaryTypeDisplayName,places.types,places.internationalPhoneNumber,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri,nextPageToken",
        },
        body: JSON.stringify({
          textQuery: searchText,
          pageSize: 20,
          languageCode: "en",
          regionCode: "US",
        }),
      }
    );

    if (!searchResponse.ok) {
      const errText = await searchResponse.text();
      return new Response(
        JSON.stringify({
          error: `Google Places API error: ${searchResponse.status}`,
          details: errText,
          configured: true,
          buyers: [],
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await searchResponse.json();
    const places: PlaceResult[] = data.places || [];

    const buyers = places.map((place) => {
      // Parse address components
      const formattedAddress = place.formattedAddress || "";
      const addressParts = formattedAddress.split(",").map((s) => s.trim());

      let parsedCity = "";
      let parsedState = "";
      let parsedCountry = "United States";

      // US addresses typically end with "City, STATE ZIP, Country"
      if (addressParts.length >= 3) {
        parsedCountry = addressParts[addressParts.length - 1] || "United States";
        const stateZip = addressParts[addressParts.length - 2] || "";
        const stateMatch = stateZip.match(/([A-Z]{2})/);
        parsedState = stateMatch ? stateMatch[1] : stateZip;
        parsedCity = addressParts[addressParts.length - 3] || "";
      }

      const categoryText =
        place.primaryTypeDisplayName?.text ||
        (place.types && place.types.length > 0
          ? place.types[0].replace(/_/g, " ")
          : "Home Decor");

      return {
        place_id: place.id,
        name: place.displayName?.text || "Unknown Business",
        category: categoryText,
        address: formattedAddress,
        city: parsedCity,
        state: parsedState,
        country: parsedCountry,
        phone:
          place.internationalPhoneNumber ||
          place.nationalPhoneNumber ||
          "Phone not available",
        email: "Email not available",
        website: place.websiteUri || "Website not available",
        google_maps_uri: place.googleMapsUri || "",
        source: "Google Places API",
      };
    });

    return new Response(
      JSON.stringify({
        buyers,
        configured: true,
        searchQuery: searchText,
        totalCount: buyers.length,
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
        configured: true,
        buyers: [],
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
