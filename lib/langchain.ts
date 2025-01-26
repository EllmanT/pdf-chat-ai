import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { createStuffDocumentsChain } from "@langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "@langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "@langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o",
});

export const indexName = "tapiwae";

export async function generateDocs(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not found");
  }

  console.log("Fetching the url from firebase ...");
  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = firebaseRef.data()?.downloadUrl;
  if (!downloadUrl) {
    throw new Error("Download Url not found");
  }

  console.log(`download url fetched successfully : ${downloadUrl}------`);

  const response = await fetch(downloadUrl);

  const data = await response.blob();

  console.log("Loading pdf document");
  const loader = new PDFLoader(data);
  const docs = await loader.load();
  // split document into smaller chunks
  console.log("Splitting the document into smaller parts");

  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);

  console.log(`Split into ${splitDocs.length} parts ---- `);

  return splitDocs;
}

export async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error("No namespace value provided");
  const { namespaces } = await index.describeIndexStats();

  return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }
  let pineconeVectorStore;

  // Generate embeddings (numerical representation for the split documents)
  console.log("--- Generating embedings ----");
  const embeddings = new OpenAIEmbeddings();
  const index = await pineconeClient.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);

  if (namespaceAlreadyExists) {
    console.log(
      `Namespace ${docId} already exists , reusing existing embedings`
    );
    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });
    return pineconeVectorStore;
  } else {
    // if the snamespace does not exist download the pdf from firestorm  via the store
    const splitDocs = await generateDocs(docId);

    console.log(
      `Storing the emedings in namespace ${docId} in the ${indexName} Pinecone vector store ...----`
    );

    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docId,
      }
    );

    return pineconeVectorStore
  }
  
}
