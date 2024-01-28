import OpenAI from "openai";
import Config from "../config";

const openai = new OpenAI({ apiKey: Config.openaiApiKey });

export async function ratePoliticalStance(
  allArticles: string
): Promise<Number> {
  const prompt = `Based on the following articles, please analyze and score the news reader's political stance:\n${allArticles}\n\nScore from -100 to 100, where -100 indicates extremely left-leaning views, 0 is neutral, and 100 indicates extremely right-leaning views.\n\nProvide a brief explanation for your score, summarizing the reader's tendencies based on their chosen articles.}`;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      functions: [
        {
          name: "publishPoliticalStanceRating",
          parameters: {
            politicalStanceRating: {
              type: "number",
              description:
                "The political stance rating of the user based on the articles they have chosen",
            },
          },
        },
      ],
      function_call: {
        name: "publishPoliticalStanceRating",
      },
    });

    console.log(response);

    const completion = response.choices[0].message.content;
    const politicalStanceRating = Number(completion);
    return politicalStanceRating;
  } catch (err) {
    console.trace(err);
  }
}