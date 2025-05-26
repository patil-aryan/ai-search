import { BaseMessage } from "@langchain/core/messages";
import {
  PromptTemplate,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnableMap,
  RunnableLambda,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Document } from "@langchain/core/documents";
import { searchSearxng } from "../lib/searxng";
import type { StreamEvent } from "@langchain/core/tracers/log_stream";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { Embeddings } from "@langchain/core/embeddings";
import formatChatHistoryAsString from "../utils/formatHistory";
import { EventEmitter } from "events";
import computeSimilarity from "../utils/computeSimilarity";

const basicBusinessSearchRetrieverPrompt = `
You will be given a conversation below and a follow up question. You need to rephrase the follow-up question if needed so it is a standalone question that can be used by the LLM to search for business-related information.
Focus on business, market, financial, company, and industry-related terms. Add business context to general queries where appropriate.
If it is a writing task or a simple hi, hello rather than a question, you need to return \`not_needed\` as the response.

Example:
1. Follow up question: What is the stock price of Apple?
Rephrased: Apple stock price AAPL current market value

2. Follow up question: How is Tesla performing this quarter?
Rephrased: Tesla quarterly performance Q3 2024 financial results

3. Follow up question: What are the latest trends in AI industry?
Rephrased: AI artificial intelligence industry trends market analysis 2024

4. Follow up question: Tell me about Microsoft's recent acquisitions
Rephrased: Microsoft recent acquisitions mergers business deals

5. Follow up question: What is cryptocurrency market doing?
Rephrased: cryptocurrency market trends Bitcoin Ethereum price analysis

Conversation:
{chat_history}

Follow up question: {query}
Rephrased question:
`;

const basicBusinessSearchResponsePrompt = `
    You are futuresearch, an AI model who is expert at searching for business and market information. You are set on focus mode 'Business', this means you will be searching for business-related content, market news, company information, financial data, and industry insights.

    Generate a response that is informative and relevant to the user's business query based on provided context (the context consists of search results containing business information, market data, company news, and financial insights).
    You must use this context to answer the user's query in the best way possible. Use a professional and analytical tone in your response. Do not repeat the text.
    You must not tell the user to open any link or visit any website to get the answer. You must provide the answer in the response itself. If the user asks for links you can provide them.
    
    Focus on providing:
    - Current market information and trends
    - Company performance and financial data
    - Industry analysis and insights
    - Business news and developments
    - Economic indicators and market sentiment
    - Investment perspectives and analysis
    
    Your responses should be medium to long in length, informative and relevant to the user's business query. You can use markdowns to format your response. You should use bullet points to list financial data, market trends, and key business insights. Make sure the answer is comprehensive and business-focused.
    
    You have to cite the answer using [number] notation. You must cite the sentences with their relevant context number. You must cite each and every part of the answer so the user can know where the information is coming from.
    Place these citations at the end of that particular sentence. You can cite the same sentence multiple times if it is relevant to the user's query like [number1][number2].
    However you do not need to cite it using the same number. You can use different numbers to cite the same sentence multiple times. The number refers to the number of the search result (passed in the context) used to generate that part of the answer.

    Anything inside the following \`context\` HTML block provided below is for your knowledge returned by the search engine and is not shared by the user. You have to answer question on the basis of it and cite the relevant information from it but you do not have to 
    talk about the context in your response. 

    <context>
    {context}
    </context>

    If you think there's nothing relevant in the search results, you can say that 'Hmm, sorry I could not find any relevant business information on this topic. Would you like me to search again or ask something else?'.
    Anything between the \`context\` is retrieved from a search engine and is not a part of the conversation with the user. Today's date is ${new Date().toISOString()}
`;

const strParser = new StringOutputParser();

const handleStream = async (
  stream: AsyncGenerator<StreamEvent, any, unknown>,
  emitter: EventEmitter
) => {
  for await (const event of stream) {
    if (
      event.event === "on_chain_end" &&
      event.name === "FinalSourceRetriever"
    ) {
      emitter.emit(
        "data",
        JSON.stringify({ type: "sources", data: event.data.output })
      );
    }
    if (
      event.event === "on_chain_stream" &&
      event.name === "FinalResponseGenerator"
    ) {
      emitter.emit(
        "data",
        JSON.stringify({ type: "response", data: event.data.chunk })
      );
    }
    if (
      event.event === "on_chain_end" &&
      event.name === "FinalResponseGenerator"
    ) {
      emitter.emit("end");
    }
  }
};

type BasicChainInput = {
  chat_history: BaseMessage[];
  query: string;
};

const createBasicBusinessSearchRetrieverChain = (llm: BaseChatModel) => {
  return RunnableSequence.from([
    PromptTemplate.fromTemplate(basicBusinessSearchRetrieverPrompt),
    llm,
    strParser,
    RunnableLambda.from(async (input: string) => {
      if (input === "not_needed") {
        return { query: "", docs: [] };
      }

      // Enhanced search for business content using multiple engines
      const res = await searchSearxng(input, {
        language: "en",
        engines: [
          "google",
          "bing",
          "yahoo", 
          "duckduckgo",
          "startpage"
        ],
      });

      const documents = res.results.map(
        (result) =>
          new Document({
            pageContent: result.content,
            metadata: {
              title: result.title,
              url: result.url,
              ...(result.img_src && { img_src: result.img_src }),
            },
          })
      );

      return { query: input, docs: documents };
    }),
  ]);
};

const createBasicBusinessSearchAnsweringChain = (
  llm: BaseChatModel,
  embeddings: Embeddings
) => {
  const basicBusinessSearchRetrieverChain = createBasicBusinessSearchRetrieverChain(llm);

  const processDocs = async (docs: Document[]) => {
    return docs
      .map((_, index) => `${index + 1}. ${docs[index].pageContent}`)
      .join("\n");
  };

  const rerankDocs = async ({
    query,
    docs,
  }: {
    query: string;
    docs: Document[];
  }) => {
    if (docs.length === 0) {
      return docs;
    }

    const docsWithContent = docs.filter(
      (doc) => doc.pageContent && doc.pageContent.length > 0
    );

    const [docEmbeddings, queryEmbedding] = await Promise.all([
      embeddings.embedDocuments(docsWithContent.map((doc) => doc.pageContent)),
      embeddings.embedQuery(query),
    ]);

    const similarity = docEmbeddings.map((docEmbedding, i) => {
      const sim = computeSimilarity(queryEmbedding, docEmbedding);

      return {
        index: i,
        similarity: sim,
      };
    });

    const sortedDocs = similarity
      .sort((a, b) => b.similarity - a.similarity)
      .filter((sim) => sim.similarity > 0.5)
      .slice(0, 15)
      .map((sim) => docsWithContent[sim.index]);

    return sortedDocs;
  };

  return RunnableSequence.from([
    RunnableMap.from({
      query: (input: BasicChainInput) => input.query,
      chat_history: (input: BasicChainInput) => input.chat_history,
      context: RunnableSequence.from([
        (input) => ({
          query: input.query,
          chat_history: formatChatHistoryAsString(input.chat_history),
        }),
        basicBusinessSearchRetrieverChain
          .pipe(rerankDocs)
          .withConfig({
            runName: "FinalSourceRetriever",
          })
          .pipe(processDocs),
      ]),
    }),
    ChatPromptTemplate.fromMessages([
      ["system", basicBusinessSearchResponsePrompt],
      new MessagesPlaceholder("chat_history"),
      ["user", "{query}"],
    ]),
    llm,
    strParser,
  ]).withConfig({
    runName: "FinalResponseGenerator",
  });
};

const basicBusinessSearch = (
  query: string,
  history: BaseMessage[],
  llm: BaseChatModel,
  embeddings: Embeddings
) => {
  const emitter = new EventEmitter();

  try {
    const basicBusinessSearchAnsweringChain = createBasicBusinessSearchAnsweringChain(
      llm,
      embeddings
    );

    const stream = basicBusinessSearchAnsweringChain.streamEvents(
      {
        chat_history: history,
        query: query,
      },
      {
        version: "v1",
      }
    );

    handleStream(stream, emitter);
  } catch (err) {
    emitter.emit(
      "error",
      JSON.stringify({
        data: `An error has occurred please try again later: ${err}`,
      })
    );
  }

  return emitter;
};

const handleBusinessSearch = (
  message: string,
  history: BaseMessage[],
  llm: BaseChatModel,
  embeddings: Embeddings
) => {
  const emitter = basicBusinessSearch(message, history, llm, embeddings);
  return emitter;
};

export default handleBusinessSearch;
