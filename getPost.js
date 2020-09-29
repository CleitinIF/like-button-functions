const faunadb = require("faunadb");

const query = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

module.exports.handle = async (event, context) => {
  const id = Number(event.pathParameters.id);

  if (!id) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": process.env.ORIGIN_ADDRESS,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ message: "You need to send the post id in url" }),
    };
  }

  try {
    const response = await client.query(
      query.Select(
        "data",
        query.Get(query.Match(query.Index("post_by_id"), id))
      )
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ORIGIN_ADDRESS,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("[Error] - getPost function");
    console.error(error);
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": process.env.ORIGIN_ADDRESS,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ message: "Internal error" }),
    };
  }
};
