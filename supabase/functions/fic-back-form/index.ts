import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaintMicronEntry {
  row: number;
  fillLid?: string;
  allBody?: string;
  hood?: string;
  roof?: string;
  trunkTailgate?: string;
  fenderLeft?: string;
  fenderRight?: string;
  rearPanelLeft?: string;
  rearPanelRight?: string;
  frontDoor1?: string;
  frontDoor2?: string;
  rearDoor3?: string;
  rearDoor4?: string;
  pillarLeft?: string;
  pillarRight?: string;
  locationMain?: string;
  locationFinal?: string;
  repairConfirmedBy?: string;
}

interface PartsChangeEntry {
  row: number;
  partName?: string;
  removeX?: boolean;
  removedBy?: string;
  installedBy?: string;
  inspectedBy?: string;
}

interface FICBackFormData {
  vin?: string;
  section: 'paintMicrons' | 'partsChanges' | 'both';
  paintMicrons?: PaintMicronEntry[];
  partsChanges?: PartsChangeEntry[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === 'POST') {
      const data: FICBackFormData = await req.json();
      
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

      if (!data.section) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Section is required. Valid values: paintMicrons, partsChanges, both' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Validate section-specific data
      if ((data.section === 'paintMicrons' || data.section === 'both') && !data.paintMicrons) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'paintMicrons array is required when section is paintMicrons or both' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if ((data.section === 'partsChanges' || data.section === 'both') && !data.partsChanges) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'partsChanges array is required when section is partsChanges or both' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Validate paint microns rows (0-9)
      if (data.paintMicrons) {
        for (const entry of data.paintMicrons) {
          if (entry.row < 0 || entry.row > 9) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: `Invalid paint microns row: ${entry.row}. Valid range is 0-9` 
              }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }
        }
      }

      // Validate parts changes rows (0-11)
      if (data.partsChanges) {
        for (const entry of data.partsChanges) {
          if (entry.row < 0 || entry.row > 11) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: `Invalid parts change row: ${entry.row}. Valid range is 0-11` 
              }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }
        }
      }

      // Store the data in the database for the form to pick up
      const { error: insertError } = await supabase
        .from('fic_form_pending_data')
        .insert({
          vin: data.vin,
          form_type: 'back_form',
          section: data.section,
          data: {
            paintMicrons: data.paintMicrons,
            partsChanges: data.partsChanges
          },
          processed: false
        });

      if (insertError) {
        console.error('Error inserting pending data:', insertError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Failed to store form data',
            details: insertError.message 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'FIC Back Form data received and queued for form update',
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
      return new Response(
        JSON.stringify({
          endpoint: '/fic-back-form',
          methods: ['POST', 'GET'],
          description: 'API endpoint for FIC Back Form (Page 2) - Paint Microns and Parts Changes. Data sent via POST will automatically populate the form in real-time.',
          schema: {
            vin: { type: 'string', required: true, description: 'Vehicle Identification Number' },
            section: { 
              type: 'string', 
              required: true, 
              enum: ['paintMicrons', 'partsChanges', 'both'],
              description: 'Which section(s) to update'
            },
            paintMicrons: {
              type: 'array',
              description: 'Paint micron readings (rows 0-9)',
              items: {
                row: { type: 'number', required: true, description: 'Row index (0-9)' },
                fillLid: { type: 'string' },
                allBody: { type: 'string' },
                hood: { type: 'string' },
                roof: { type: 'string' },
                trunkTailgate: { type: 'string' },
                fenderLeft: { type: 'string' },
                fenderRight: { type: 'string' },
                rearPanelLeft: { type: 'string' },
                rearPanelRight: { type: 'string' },
                frontDoor1: { type: 'string' },
                frontDoor2: { type: 'string' },
                rearDoor3: { type: 'string' },
                rearDoor4: { type: 'string' },
                pillarLeft: { type: 'string' },
                pillarRight: { type: 'string' },
                locationMain: { type: 'string' },
                locationFinal: { type: 'string' },
                repairConfirmedBy: { type: 'string' }
              }
            },
            partsChanges: {
              type: 'array',
              description: 'Parts on/off changes (rows 0-11)',
              items: {
                row: { type: 'number', required: true, description: 'Row index (0-11)' },
                partName: { type: 'string' },
                removeX: { type: 'boolean' },
                removedBy: { type: 'string' },
                installedBy: { type: 'string' },
                inspectedBy: { type: 'string' }
              }
            }
          },
          exampleRequests: {
            paintMicronsOnly: {
              vin: "5J8YD9H43TL000680",
              section: "paintMicrons",
              paintMicrons: [
                { row: 0, hood: "85", roof: "90", fenderLeft: "82", fenderRight: "84", repairConfirmedBy: "John" },
                { row: 1, hood: "88", roof: "92", locationMain: "Bay 3", repairConfirmedBy: "Jane" }
              ]
            },
            partsChangesOnly: {
              vin: "5J8YD9H43TL000680",
              section: "partsChanges",
              partsChanges: [
                { row: 0, partName: "Front Bumper", removeX: true, removedBy: "Mike", installedBy: "Mike", inspectedBy: "Sarah" },
                { row: 1, partName: "Headlight Assembly", removeX: false, removedBy: "Tom", installedBy: "Tom", inspectedBy: "Sarah" }
              ]
            },
            bothSections: {
              vin: "5J8YD9H43TL000680",
              section: "both",
              paintMicrons: [
                { row: 0, hood: "85", roof: "90", repairConfirmedBy: "John" }
              ],
              partsChanges: [
                { row: 0, partName: "Front Bumper", removeX: true, removedBy: "Mike", installedBy: "Mike", inspectedBy: "Sarah" }
              ]
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