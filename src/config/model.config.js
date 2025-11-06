import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
});

const client = new MongoClient(process.env.MONGODB_URI || "");
const collection = client
  .db(process.env.MONGODB_VECTOR_DB_NAME)
  .collection(process.env.MONGODB_VECTOR_COLLECTION_NAME);

const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
  collection: collection,
  indexName: "vector_index",
  textKey: "text",
  embeddingKey: "embedding",
});

export { embeddings, vectorStore };
