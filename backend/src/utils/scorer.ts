import OpenAI from "openai";
import Config from "../config";
import Press from "../models/Press";

const openai = new OpenAI({ apiKey: Config.openaiApiKey });
const MODEL_NAME = "gpt-4-turbo-preview";

export async function ratePoliticalStance(
  pressFreqencyMap: string
): Promise<number> {
  const prompt = `Based on the frequency of the following presses that appears on the user's news feed selection, please analyze and score the current news page's political stance:\n\n${pressFreqencyMap}\n\nScore from -100 to 100, where -100 indicates extremely left-leaning views, 0 is neutral, and 100 indicates extremely right-leaning views. Please provide a score for the current news page's political stance:`;
  try {
    const response = await openai.chat.completions.create({
      model: MODEL_NAME,
      max_tokens: 100,
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      functions: [
        {
          name: "publishPoliticalStanceRating",
          description:
            "Rates the political stance of the user based on the press frequency of each News Press the user selects.",
          parameters: {
            type: "object",
            properties: {
              politicalStanceRating: {
                type: "number",
                description:
                  "The political stance rating of the user based on the press frequency map.",
              },
            },
            required: ["politicalStanceRating"],
          },
        },
      ],
      function_call: {
        name: "publishPoliticalStanceRating",
      },
    });

    const completion = response.choices[0].message.function_call.arguments;

    const parsedCompletion = JSON.parse(completion);

    console.log(parsedCompletion);
    console.log(parsedCompletion.politicalStanceRating);

    return parsedCompletion.politicalStanceRating;
  } catch (err) {
    console.trace(err);
  }
}

async function ratePressPoliticalStance(pressName: string): Promise<number> {
  const prompt = `Based on the following press name, please analyze and score the press's political stance:\n\n${pressName}\n\nScore from -100 to 100, where -100 indicates extremely left-leaning views, 0 is neutral, and 100 indicates extremely right-leaning views. Please provide a score for the press's political stance:`;
  try {
    const response = await openai.chat.completions.create({
      model: MODEL_NAME,
      max_tokens: 100,
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      functions: [
        {
          name: "publishPoliticalStanceRating",
          description:
            "Rates the political stance of the press based on the press name.",
          parameters: {
            type: "object",
            properties: {
              politicalStanceRating: {
                type: "number",
                description:
                  "The political stance rating of the press based on the press name.",
              },
            },
            required: ["politicalStanceRating"],
          },
        },
      ],
      function_call: {
        name: "publishPoliticalStanceRating",
      },
    });

    const completion = response.choices[0].message.function_call.arguments;

    const parsedCompletion = JSON.parse(completion);

    console.log(parsedCompletion);
    console.log(parsedCompletion.politicalStanceRating);

    return parsedCompletion.politicalStanceRating;
  } catch (err) {
    console.trace(err);
  }
}

export async function ratePressesPoliticalStanceIfNotExists(pressFreqencyMap: {
  [key: string]: number;
}): Promise<number> {
  let left = 0;
  let right = 0;

  for (const pressName of Object.keys(pressFreqencyMap)) {
    const existingPress = await Press.findOne({ name: pressName }).exec();
    if (existingPress) {
      if (existingPress.leaning === "left") {
        left += pressFreqencyMap[pressName];
      } else if (existingPress.leaning === "right") {
        right += pressFreqencyMap[pressName];
      }
      continue;
    }
    const politicalStanceRating = await ratePressPoliticalStance(pressName);
    await Press.create({
      name: pressName,
      politicalStance: politicalStanceRating,
      leaning: politicalStanceRating > 0 ? "right" : "left",
      ratingAuthor: MODEL_NAME,
    });
    if (politicalStanceRating > 0) {
      right += pressFreqencyMap[pressName];
    } else {
      left += pressFreqencyMap[pressName];
    }
  }

  return ((right - left) / (right + left)) * 100;
}
