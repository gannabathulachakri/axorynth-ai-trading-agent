import { getOpenAIClient, OPENAI_MODEL } from "@/src/lib/openai";
import { generateLocalSignal } from "@/src/services/signalEngine";
import type { MarketAsset } from "@/src/types/trading";
import type { AiTradeSignal, SignalEngineInput } from "@/src/types/signal";

const reasoningSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marketSentiment: { type: "string" },
    reasoning: { type: "string", maxLength: 240 }
  },
  required: ["marketSentiment", "reasoning"]
};

export async function generateAiAnalysis(
  asset: MarketAsset,
  input: SignalEngineInput
): Promise<AiTradeSignal> {
  const localSignal = generateLocalSignal(asset, input);
  const client = getOpenAIClient();

  if (!client) {
    return {
      ...localSignal,
      model: "local-signal-engine",
      fallback: true
    };
  }

  try {
    const response = await client.responses.create({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content:
            "You are Axorynth, a crypto market intelligence narrator. The trade decision is already computed by local risk rules. Improve only the professional reasoning text. Do not suggest real-money execution."
        },
        {
          role: "user",
          content: JSON.stringify({
            symbol: asset.symbol,
            price: asset.price,
            dataSource: input.providerLabel,
            decision: localSignal.decision,
            confidence: localSignal.confidence,
            riskLevel: localSignal.riskLevel,
            riskScore: localSignal.riskScore,
            indicators: asset.indicators.cards.map((indicator) => ({
              label: indicator.label,
              value: indicator.displayValue,
              status: indicator.status
            })),
            why: localSignal.why
          })
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "axorynth_reasoning",
          strict: true,
          schema: reasoningSchema
        }
      }
    });

    const parsed = JSON.parse(response.output_text) as {
      marketSentiment?: string;
      reasoning?: string;
    };

    return {
      ...localSignal,
      marketSentiment: parsed.marketSentiment || localSignal.marketSentiment,
      reasoning: parsed.reasoning || localSignal.reasoning,
      model: `${OPENAI_MODEL}+local-rules`,
      fallback: false
    };
  } catch {
    return {
      ...localSignal,
      model: "local-signal-engine",
      fallback: true
    };
  }
}
