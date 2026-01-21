import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Random walk price simulation with mean reversion
function simulatePriceChange(currentPrice: number, volatility: number = 0.02): number {
  // Random component
  const randomChange = (Math.random() - 0.5) * 2 * volatility;
  
  // Mean reversion towards 0.5 (center of 0-1 range)
  const meanReversionStrength = 0.01;
  const meanReversion = (0.5 - currentPrice) * meanReversionStrength;
  
  // Calculate new price
  let newPrice = currentPrice + randomChange + meanReversion;
  
  // Clamp between 0.01 and 0.99
  newPrice = Math.max(0.01, Math.min(0.99, newPrice));
  
  // Round to 2 decimal places
  return Math.round(newPrice * 100) / 100;
}

// For binary events, ensure prices sum to ~1.0
function adjustBinaryPrices(yesPrice: number): { yes: number; no: number } {
  const yes = Math.round(yesPrice * 100) / 100;
  const no = Math.round((1 - yes) * 100) / 100;
  return { yes, no };
}

// For multi-option events, normalize prices to sum to 1.0
function normalizeMultiOptionPrices(prices: number[]): number[] {
  const sum = prices.reduce((a, b) => a + b, 0);
  return prices.map(p => Math.round((p / sum) * 100) / 100);
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting price update job...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active (non-resolved) events
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("id, name")
      .eq("is_resolved", false);

    if (eventsError) {
      console.error("Error fetching events:", eventsError);
      throw eventsError;
    }

    console.log(`Found ${events?.length || 0} active events`);

    if (!events || events.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No active events to update" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let updatedCount = 0;
    let priceHistoryInserted = 0;

    for (const event of events) {
      // Get current options for this event
      const { data: options, error: optionsError } = await supabase
        .from("event_options")
        .select("id, label, price")
        .eq("event_id", event.id)
        .order("id");

      if (optionsError || !options || options.length === 0) {
        console.log(`No options found for event ${event.id}, skipping`);
        continue;
      }

      const isBinary = options.length === 2 && 
        options.some(o => o.label.toLowerCase() === "yes") &&
        options.some(o => o.label.toLowerCase() === "no");

      let newPrices: { id: string; price: number }[] = [];

      if (isBinary) {
        // Binary event - update Yes price and derive No
        const yesOption = options.find(o => o.label.toLowerCase() === "yes")!;
        const noOption = options.find(o => o.label.toLowerCase() === "no")!;
        
        const newYesPrice = simulatePriceChange(Number(yesOption.price), 0.03);
        const { yes, no } = adjustBinaryPrices(newYesPrice);
        
        newPrices = [
          { id: yesOption.id, price: yes },
          { id: noOption.id, price: no },
        ];
      } else {
        // Multi-option event - simulate each and normalize
        const simulatedPrices = options.map(o => 
          simulatePriceChange(Number(o.price), 0.02)
        );
        const normalized = normalizeMultiOptionPrices(simulatedPrices);
        
        newPrices = options.map((o, i) => ({
          id: o.id,
          price: normalized[i],
        }));
      }

      // Update prices in event_options table
      for (const { id, price } of newPrices) {
        const { error: updateError } = await supabase
          .from("event_options")
          .update({ price, updated_at: new Date().toISOString() })
          .eq("id", id);

        if (updateError) {
          console.error(`Error updating option ${id}:`, updateError);
        } else {
          updatedCount++;
        }

        // Insert price history record
        const { error: historyError } = await supabase
          .from("price_history")
          .insert({
            event_id: event.id,
            option_id: id,
            price,
            recorded_at: new Date().toISOString(),
          });

        if (historyError) {
          console.error(`Error inserting price history for ${id}:`, historyError);
        } else {
          priceHistoryInserted++;
        }
      }

      console.log(`Updated ${newPrices.length} options for event: ${event.name}`);
    }

    console.log(`Price update complete. Updated ${updatedCount} options, inserted ${priceHistoryInserted} history records.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        updatedOptions: updatedCount,
        historyRecordsInserted: priceHistoryInserted,
        eventsProcessed: events.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in update-prices function:", error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
