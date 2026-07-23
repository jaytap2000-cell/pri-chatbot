exports.handler = async function (event) {
  if (event.queryStringParameters && event.queryStringParameters.debug === "1") {
    const key = process.env.ANTHROPIC_API_KEY || "";
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keyExists: !!process.env.ANTHROPIC_API_KEY,
        keyLength: key.length,
        startsWith: key.slice(0, 12),
        endsWith: key.slice(-6),
        hasWhitespace: /\s/.test(key),
      }),
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
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
