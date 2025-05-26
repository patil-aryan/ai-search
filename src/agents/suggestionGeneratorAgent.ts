import { RunnableSequence, RunnableMap } from "@langchain/core/runnables";
import ListLineOutputParser from "../lib/outputParsers/listLineOutputParser";
import { PromptTemplate } from "@langchain/core/prompts";
import formatChatHistoryAsString from "../utils/formatHistory";
import { BaseMessage } from "@langchain/core/messages";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatOpenAI } from "@langchain/openai";
const suggestionGeneratorPrompt = `

You are an AI suggestion generator for an AI powered search engine. You will be given a conversation below. You need to generate 4-5 detailed and informative suggestions based on the conversation. The suggestions should be phrased as questions or prompts that a user might ask to get more in-depth information or explore related topics. 
Ensure the suggestions are significantly longer and more comprehensive than simple keywords. They should guide the user towards a deeper exploration of the subject matter.
Make sure the suggestions are medium to long in length, are highly relevant to the conversation, and are helpful to the user for further inquiry.
Provide these suggestions separated by newlines between the XML tags <suggestions> and </suggestions>. For example:
<suggestions>
Can you elaborate on the specific technological advancements SpaceX has made in rocket reusability and how they compare to other space agencies?
What are the primary objectives and timelines for SpaceX's upcoming Starship missions, and what potential impact could they have on interplanetary travel?
Could you provide a detailed overview of Elon Musk's leadership style at SpaceX and how it has influenced the company's culture and innovation?
</suggestions>
Conversation:
{chat_history}
`;
type SuggestionGeneratorInput = {
  chat_history: BaseMessage[];
};

const outputParser = new ListLineOutputParser({
  key: "suggestions",
});
const createSuggestionGeneratorChain = (llm: BaseChatModel) => {
  return RunnableSequence.from([
    RunnableMap.from({
      chat_history: (input: SuggestionGeneratorInput) =>
        formatChatHistoryAsString(input.chat_history),
    }),
    PromptTemplate.fromTemplate(suggestionGeneratorPrompt),
    llm,
    outputParser,
  ]);
};
const generateSuggestions = (
  input: SuggestionGeneratorInput,
  llm: BaseChatModel
) => {
  (llm as any).temperature = 0;
  const suggestionGeneratorChain = createSuggestionGeneratorChain(llm);
  return suggestionGeneratorChain.invoke(input);
};
export default generateSuggestions;
