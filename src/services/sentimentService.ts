
type SentimentResponse = {
  label: "positive" | "neutral" | "negative";
};

export async function predictSentiment(text: string, model: string): Promise<SentimentResponse> {
  try {
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, model }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to analyze sentiment");
  }
}
