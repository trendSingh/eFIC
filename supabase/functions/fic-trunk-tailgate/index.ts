import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrunkTailgateData {
  vin?: string;
  tailgateFunction?: {
    wiuAssoc?: string;
    rej?: boolean;
    repairedBy?: string;
    inspectedBy?: string;
  };
  seatbeltFunction?: {
    wiuAssoc?: string;
    rej?: boolean;
    repairedBy?: string;
    inspectedBy?: string;
  };
  seatHeadrest?: {
    wiuAssoc?: string;
    rej?: boolean;
    repairedBy?: string;
    inspectedBy?: string;
  };
  vinLabelPrintedCondition?: {
    wiuAssoc?: string;
    rej?: boolean;
    repairedBy?: string;
    inspectedBy?: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method === 'POST') {
      const data: TrunkTailgateData = await req.json();
      
      // Validate required fields
      if (!data.vin) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'VIN is required' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Return the processed data (in a real app, you might store this in a database)
      return new Response(
        JSON.stringify({
          success: true,
          message: 'TRUNK/TAILGATE data received successfully',
          receivedData: data,
          timestamp: new Date().toISOString()
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (req.method === 'GET') {
      // Return API documentation/schema
      return new Response(
        JSON.stringify({
          endpoint: '/fic-trunk-tailgate',
          methods: ['POST', 'GET'],
          description: 'API endpoint for TRUNK/TAILGATE inspection data',
          schema: {
            vin: { type: 'string', required: true, description: 'Vehicle Identification Number' },
            tailgateFunction: {
              type: 'object',
              properties: {
                wiuAssoc: { type: 'string', description: 'WIU Associate number' },
                rej: { type: 'boolean', description: 'Rejection status' },
                repairedBy: { type: 'string', description: 'Repaired by associate name' },
                inspectedBy: { type: 'string', description: 'Inspected by associate name' }
              }
            },
            seatbeltFunction: {
              type: 'object',
              properties: {
                wiuAssoc: { type: 'string' },
                rej: { type: 'boolean' },
                repairedBy: { type: 'string' },
                inspectedBy: { type: 'string' }
              }
            },
            seatHeadrest: {
              type: 'object',
              properties: {
                wiuAssoc: { type: 'string' },
                rej: { type: 'boolean' },
                repairedBy: { type: 'string' },
                inspectedBy: { type: 'string' }
              }
            },
            vinLabelPrintedCondition: {
              type: 'object',
              properties: {
                wiuAssoc: { type: 'string' },
                rej: { type: 'boolean' },
                repairedBy: { type: 'string' },
                inspectedBy: { type: 'string' }
              }
            }
          },
          exampleRequest: {
            vin: "5J8YD9H43TL000680",
            tailgateFunction: {
              wiuAssoc: "12345",
              rej: false,
              repairedBy: "John Doe",
              inspectedBy: "Jane Smith"
            },
            seatbeltFunction: {
              wiuAssoc: "12346",
              rej: true,
              repairedBy: "",
              inspectedBy: ""
            }
          }
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: errorMessage 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
