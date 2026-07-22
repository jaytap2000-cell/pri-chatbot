// This is the "middleman" function.
// It runs privately on Netlify's servers — never in the visitor's browser —
// so your Anthropic API key is never exposed on your public website.

exports.handler = async function (event) {
  // Only allow POST requests (that's how the chatbot sends messages)
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY, // pulled from Netlify's secret settings
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong on the server." }),
    };
  }
};
