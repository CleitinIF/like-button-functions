const faunadb = require("faunadb");

const getId = require("./utils/getId");

const query = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

module.exports.handle = async (event, context) => {
  const id = Number(event.id);

  if (!id) {
    return {
      statusCode: 400,
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
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.log("[Error] - getPost function");
    console.log(error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Internal error" }),
    };
  }
};
