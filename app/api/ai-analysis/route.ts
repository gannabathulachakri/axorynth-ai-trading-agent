import { NextResponse } from "next/server";
import { generateAiAnalysis } from "@/src/services/aiAnalysis";
import type { MarketAsset } from "@/src/types/trading";
import type { MarketDataSource, MarketProviderLabel } from "@/src/types/market";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      asset?: MarketAsset;
      dataSource?: MarketDataSource;
      providerLabel?: MarketProviderLabel;
      leverage?: number;
    };
    if (!body.asset?.symbol || !body.asset?.candles?.length) {
      return NextResponse.json({ error: "Missing market asset payload." }, { status: 400 });
    }

    const dataSource = body.dataSource ?? "fallback";
    const providerLabel =
      body.providerLabel ??
      (dataSource === "binance" ? "LIVE: Binance" : dataSource === "coingecko" ? "LIVE: CoinGecko" : "DEMO DATA");
    const signal = await generateAiAnalysis(body.asset, {
      dataSource,
      providerLabel,
      leverage: body.leverage ?? 3
    });
    return NextResponse.json(signal, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI analysis failed." },
      { status: 500 }
    );
  }
}
