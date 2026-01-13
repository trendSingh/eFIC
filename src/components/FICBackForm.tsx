import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// API data interfaces
interface PaintMicronApiEntry {
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

interface PartsChangeApiEntry {
  row: number;
  partName?: string;
  removeX?: boolean;
  removedBy?: string;
  installedBy?: string;
  inspectedBy?: string;
}

interface FICBackFormApiData {
  vin?: string;
  section: 'paintMicrons' | 'partsChanges' | 'both';
  paintMicrons?: PaintMicronApiEntry[];
  partsChanges?: PartsChangeApiEntry[];
}

const FICBackForm = () => {
  const { toast } = useToast();
  
  const [headerChecks, setHeaderChecks] = useState({
    lsWaterleak: false,
    rsWaterleak: false,
    qicsFinalShip: false,
    repairConfirmation: false,
  });

  const [vin, setVin] = useState("5J8YD9H43TL000680");
  const [associate, setAssociate] = useState("");

  // Paint Microns table data
  const paintMicronRows = Array.from({ length: 10 }, (_, i) => i);
  const [paintMicrons, setPaintMicrons] = useState<Record<string, Record<string, string>>>(() => {
    const initial: Record<string, Record<string, string>> = {};
    paintMicronRows.forEach(row => {
      initial[row] = {
        fillLid: "", allBody: "", hood: "", roof: "", trunkTailgate: "",
        fenderLeft: "", fenderRight: "", rearPanelLeft: "", rearPanelRight: "",
        frontDoor1: "", frontDoor2: "", rearDoor3: "", rearDoor4: "",
        pillarLeft: "", pillarRight: "", locationMain: "", locationFinal: "",
        repairConfirmedBy: ""
      };
    });
    return initial;
  });

  // T-UP Primers data
  const [tUpPrimers, setTUpPrimers] = useState<Record<string, Record<string, string>>>(() => {
    const initial: Record<string, Record<string, string>> = {};
    Array.from({ length: 3 }, (_, i) => i).forEach(row => {
      initial[row] = {
        fillLid: "", allBody: "", hood: "", roof: "", trunkTailgate: "",
        fenderLeft: "", fenderRight: "", rearPanelLeft: "", rearPanelRight: "",
        frontDoor1: "", frontDoor2: "", rearDoor3: "", rearDoor4: "",
        pillarLeft: "", pillarRight: "", locationMain: "", locationFinal: "",
        repairConfirmedBy: ""
      };
    });
    return initial;
  });

  // Parts On/Off data
  const partsChangeRows = Array.from({ length: 12 }, (_, i) => i);
  const [partsChanges, setPartsChanges] = useState<Record<string, {
    partName: string;
    removeX: boolean;
    removedBy: string;
    installedBy: string;
    inspectedBy: string;
  }>>(() => {
    const initial: Record<string, any> = {};
    partsChangeRows.forEach(row => {
      initial[row] = { partName: "", removeX: false, removedBy: "", installedBy: "", inspectedBy: "" };
    });
    return initial;
  });

  // Repair Routing
  const routingBoxes = Array.from({ length: 15 }, (_, i) => i);
  const [repairRouting, setRepairRouting] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    routingBoxes.forEach(i => { initial[i] = ""; });
    return initial;
  });

  // Function to apply API data to form
  const applyApiData = (data: FICBackFormApiData) => {
    if (data.vin) {
      setVin(data.vin);
    }

    // Apply paint microns data
    if (data.paintMicrons && (data.section === 'paintMicrons' || data.section === 'both')) {
      data.paintMicrons.forEach(entry => {
        if (entry.row >= 0 && entry.row <= 9) {
          setPaintMicrons(prev => ({
            ...prev,
            [entry.row]: {
              ...prev[entry.row],
              ...(entry.fillLid !== undefined && { fillLid: entry.fillLid }),
              ...(entry.allBody !== undefined && { allBody: entry.allBody }),
              ...(entry.hood !== undefined && { hood: entry.hood }),
              ...(entry.roof !== undefined && { roof: entry.roof }),
              ...(entry.trunkTailgate !== undefined && { trunkTailgate: entry.trunkTailgate }),
              ...(entry.fenderLeft !== undefined && { fenderLeft: entry.fenderLeft }),
              ...(entry.fenderRight !== undefined && { fenderRight: entry.fenderRight }),
              ...(entry.rearPanelLeft !== undefined && { rearPanelLeft: entry.rearPanelLeft }),
              ...(entry.rearPanelRight !== undefined && { rearPanelRight: entry.rearPanelRight }),
              ...(entry.frontDoor1 !== undefined && { frontDoor1: entry.frontDoor1 }),
              ...(entry.frontDoor2 !== undefined && { frontDoor2: entry.frontDoor2 }),
              ...(entry.rearDoor3 !== undefined && { rearDoor3: entry.rearDoor3 }),
              ...(entry.rearDoor4 !== undefined && { rearDoor4: entry.rearDoor4 }),
              ...(entry.pillarLeft !== undefined && { pillarLeft: entry.pillarLeft }),
              ...(entry.pillarRight !== undefined && { pillarRight: entry.pillarRight }),
              ...(entry.locationMain !== undefined && { locationMain: entry.locationMain }),
              ...(entry.locationFinal !== undefined && { locationFinal: entry.locationFinal }),
              ...(entry.repairConfirmedBy !== undefined && { repairConfirmedBy: entry.repairConfirmedBy }),
            }
          }));
        }
      });
      toast({
        title: "Paint Microns Updated",
        description: `Updated ${data.paintMicrons.length} paint micron entries via API`,
      });
    }

    // Apply parts changes data
    if (data.partsChanges && (data.section === 'partsChanges' || data.section === 'both')) {
      data.partsChanges.forEach(entry => {
        if (entry.row >= 0 && entry.row <= 11) {
          setPartsChanges(prev => ({
            ...prev,
            [entry.row]: {
              ...prev[entry.row],
              ...(entry.partName !== undefined && { partName: entry.partName }),
              ...(entry.removeX !== undefined && { removeX: entry.removeX }),
              ...(entry.removedBy !== undefined && { removedBy: entry.removedBy }),
              ...(entry.installedBy !== undefined && { installedBy: entry.installedBy }),
              ...(entry.inspectedBy !== undefined && { inspectedBy: entry.inspectedBy }),
            }
          }));
        }
      });
      toast({
        title: "Parts Changes Updated",
        description: `Updated ${data.partsChanges.length} parts change entries via API`,
      });
    }
  };

  // Subscribe to realtime updates from API
  useEffect(() => {
    // Fetch any existing unprocessed data on mount
    const fetchPendingData = async () => {
      const { data: pendingItems, error } = await supabase
        .from('fic_form_pending_data')
        .select('*')
        .eq('form_type', 'back_form')
        .eq('processed', false)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching pending data:', error);
        return;
      }

      if (pendingItems && pendingItems.length > 0) {
        for (const item of pendingItems) {
          const itemData = item.data as { paintMicrons?: PaintMicronApiEntry[]; partsChanges?: PartsChangeApiEntry[] } | null;
          const formData: FICBackFormApiData = {
            vin: item.vin,
            section: item.section as 'paintMicrons' | 'partsChanges' | 'both',
            paintMicrons: itemData?.paintMicrons,
            partsChanges: itemData?.partsChanges
          };
          applyApiData(formData);

          // Mark as processed
          await supabase
            .from('fic_form_pending_data')
            .update({ processed: true, processed_at: new Date().toISOString() })
            .eq('id', item.id);
        }
      }
    };

    fetchPendingData();

    // Subscribe to new inserts
    const channel = supabase
      .channel('fic_back_form_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'fic_form_pending_data',
          filter: 'form_type=eq.back_form'
        },
        async (payload) => {
          console.log('Received new back form data:', payload);
          const item = payload.new as any;
          
          if (!item.processed) {
            const itemData = item.data as { paintMicrons?: PaintMicronApiEntry[]; partsChanges?: PartsChangeApiEntry[] } | null;
            const formData: FICBackFormApiData = {
              vin: item.vin,
              section: item.section as 'paintMicrons' | 'partsChanges' | 'both',
              paintMicrons: itemData?.paintMicrons,
              partsChanges: itemData?.partsChanges
            };
            applyApiData(formData);

            // Mark as processed
            await supabase
              .from('fic_form_pending_data')
              .update({ processed: true, processed_at: new Date().toISOString() })
              .eq('id', item.id);
          }
        }
      )
      .subscribe();

    // Expose the applyApiData function globally for testing
    (window as any).applyFICBackFormData = applyApiData;

    return () => {
      supabase.removeChannel(channel);
      delete (window as any).applyFICBackFormData;
    };
  }, []);

  const updatePaintMicron = (row: number, field: string, value: string) => {
    setPaintMicrons(prev => ({
      ...prev,
      [row]: { ...prev[row], [field]: value }
    }));
  };

  const updateTUpPrimer = (row: number, field: string, value: string) => {
    setTUpPrimers(prev => ({
      ...prev,
      [row]: { ...prev[row], [field]: value }
    }));
  };

  const updatePartsChange = (row: number, field: string, value: string | boolean) => {
    setPartsChanges(prev => ({
      ...prev,
      [row]: { ...prev[row], [field]: value }
    }));
  };

  const paintColumns = [
    { key: "fillLid", label: "FILL LID" },
    { key: "allBody", label: "ALL BODY" },
    { key: "hood", label: "HOOD" },
    { key: "roof", label: "ROOF" },
    { key: "trunkTailgate", label: "TRUNK/TAILGATE" },
    { key: "fenderLeft", label: "FENDER L" },
    { key: "fenderRight", label: "FENDER R" },
    { key: "rearPanelLeft", label: "REAR L" },
    { key: "rearPanelRight", label: "REAR R" },
    { key: "frontDoor1", label: "#1" },
    { key: "frontDoor2", label: "#2" },
    { key: "rearDoor3", label: "#3" },
    { key: "rearDoor4", label: "#4" },
    { key: "pillarLeft", label: "L" },
    { key: "pillarRight", label: "R" },
    { key: "locationMain", label: "MAIN" },
    { key: "locationFinal", label: "FINAL" },
    { key: "repairConfirmedBy", label: "REPAIR CONFIRMED BY" },
  ];

  return (
    <div className="p-4 max-w-full overflow-x-auto animate-fade-in">
      {/* Header Section */}
      <div className="bg-card rounded-lg border border-border shadow-sm mb-4 overflow-hidden">
        <div className="bg-form-header text-form-header-foreground px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold tracking-wide">SPEC CHECK / SAMPLING / EXPORT INSPECTION</h1>
          <span className="font-mono text-sm">Page 2 of 2</span>
        </div>

        {/* Top Controls */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-0 border-b border-border">
          <label className="form-cell flex items-center gap-3 cursor-pointer">
            <Checkbox 
              className="form-checkbox"
              checked={headerChecks.lsWaterleak}
              onCheckedChange={(checked) => setHeaderChecks(p => ({...p, lsWaterleak: !!checked}))}
            />
            <span className="text-xs font-semibold uppercase">L/S Waterleak</span>
          </label>
          <label className="form-cell flex items-center gap-3 cursor-pointer">
            <Checkbox 
              className="form-checkbox"
              checked={headerChecks.rsWaterleak}
              onCheckedChange={(checked) => setHeaderChecks(p => ({...p, rsWaterleak: !!checked}))}
            />
            <span className="text-xs font-semibold uppercase">R/S Waterleak</span>
          </label>
          <label className="form-cell flex items-center gap-3 cursor-pointer">
            <Checkbox 
              className="form-checkbox"
              checked={headerChecks.qicsFinalShip}
              onCheckedChange={(checked) => setHeaderChecks(p => ({...p, qicsFinalShip: !!checked}))}
            />
            <span className="text-xs font-semibold uppercase">QICS / Final Ship</span>
          </label>
          <label className="form-cell flex items-center gap-3 cursor-pointer">
            <Checkbox 
              className="form-checkbox"
              checked={headerChecks.repairConfirmation}
              onCheckedChange={(checked) => setHeaderChecks(p => ({...p, repairConfirmation: !!checked}))}
            />
            <span className="text-xs font-semibold uppercase">Repair Confirmation</span>
          </label>
          <div className="form-cell">
            <label className="text-xs text-muted-foreground">ASSOCIATE</label>
            <Input 
              className="form-input h-10" 
              value={associate} 
              onChange={(e) => setAssociate(e.target.value)}
            />
          </div>
        </div>

        {/* VIN Display */}
        <div className="form-cell bg-muted py-3 text-center">
          <span className="font-mono text-2xl font-bold tracking-wider">{vin}</span>
        </div>
      </div>

      {/* Vehicle Diagram Placeholder */}
      <div className="bg-card rounded-lg border border-border shadow-sm mb-4 overflow-hidden">
        <div className="form-cell form-cell-header">Vehicle Parts Diagram</div>
        <div className="p-8 flex items-center justify-center bg-muted/50 min-h-[300px]">
          <div className="text-center text-muted-foreground">
            <svg className="w-48 h-32 mx-auto mb-4 opacity-50" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.5">
              {/* Simple car outline */}
              <path d="M20 50 L30 35 L50 30 L80 28 L120 28 L150 30 L170 35 L180 50 L180 55 L20 55 L20 50" />
              <circle cx="45" cy="55" r="10" />
              <circle cx="155" cy="55" r="10" />
              <path d="M55 30 L65 20 L135 20 L145 30" />
            </svg>
            <p className="text-sm font-medium">Interactive vehicle diagram</p>
            <p className="text-xs">Tap parts to mark inspection areas</p>
          </div>
        </div>
      </div>

      {/* Paint Microns Table */}
      <div className="bg-card rounded-lg border border-border shadow-sm mb-4 overflow-hidden">
        <div className="form-cell form-cell-header flex items-center justify-between">
          <span>CHECK PAINT MICRONS EACH TIME A REPAIR IS MADE</span>
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">API Enabled</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="form-cell form-cell-section" rowSpan={2}>FILL LID</th>
                <th className="form-cell form-cell-section" rowSpan={2}>ALL BODY</th>
                <th className="form-cell form-cell-section" rowSpan={2}>HOOD</th>
                <th className="form-cell form-cell-section" rowSpan={2}>ROOF</th>
                <th className="form-cell form-cell-section" rowSpan={2}>TRUNK/TAILGATE</th>
                <th className="form-cell form-cell-section text-center" colSpan={2}>FENDER</th>
                <th className="form-cell form-cell-section text-center" colSpan={2}>REAR PANEL</th>
                <th className="form-cell form-cell-section text-center" colSpan={2}>FRONT DOOR</th>
                <th className="form-cell form-cell-section text-center" colSpan={2}>REAR DOOR</th>
                <th className="form-cell form-cell-section text-center" colSpan={2}>PILLAR</th>
                <th className="form-cell form-cell-section text-center" colSpan={2}>LOCATION</th>
                <th className="form-cell form-cell-section" rowSpan={2}>REPAIR CONFIRMED BY</th>
              </tr>
              <tr>
                <th className="form-cell form-cell-section">LEFT</th>
                <th className="form-cell form-cell-section">RIGHT</th>
                <th className="form-cell form-cell-section">LEFT</th>
                <th className="form-cell form-cell-section">RIGHT</th>
                <th className="form-cell form-cell-section">#1</th>
                <th className="form-cell form-cell-section">#2</th>
                <th className="form-cell form-cell-section">#3</th>
                <th className="form-cell form-cell-section">#4</th>
                <th className="form-cell form-cell-section">LEFT</th>
                <th className="form-cell form-cell-section">RIGHT</th>
                <th className="form-cell form-cell-section">MAIN</th>
                <th className="form-cell form-cell-section">FINAL</th>
              </tr>
            </thead>
            <tbody>
              {paintMicronRows.map(row => (
                <tr key={row} className="hover:bg-cell-hover">
                  {paintColumns.map(col => (
                    <td key={col.key} className="form-cell p-0">
                      <Input 
                        className="form-input h-10 text-center text-xs" 
                        value={paintMicrons[row]?.[col.key] || ""}
                        onChange={(e) => updatePaintMicron(row, col.key, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Final T-UP Primers */}
      <div className="bg-card rounded-lg border border-border shadow-sm mb-4 overflow-hidden">
        <div className="form-cell form-cell-header">FINAL T-UP PRIMERS ONLY</div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <tbody>
              {[0, 1, 2].map(row => (
                <tr key={row} className="hover:bg-cell-hover">
                  {paintColumns.map(col => (
                    <td key={col.key} className="form-cell p-0">
                      <Input 
                        className="form-input h-10 text-center text-xs" 
                        value={tUpPrimers[row]?.[col.key] || ""}
                        onChange={(e) => updateTUpPrimer(row, col.key, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parts On/Off Table */}
      <div className="bg-card rounded-lg border border-border shadow-sm mb-4 overflow-hidden">
        <div className="form-cell form-cell-header flex items-center justify-between">
          <span>PARTS ON/OFF - PART CHANGES</span>
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">API Enabled</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="form-cell form-cell-section text-left">PART NAME</th>
                <th className="form-cell form-cell-section text-center w-20">REMOVE X</th>
                <th className="form-cell form-cell-section text-center w-28">REMOVED BY</th>
                <th className="form-cell form-cell-section text-center w-28">INSTALLED BY</th>
                <th className="form-cell form-cell-section text-center w-28">INSPECTED BY</th>
              </tr>
            </thead>
            <tbody>
              {partsChangeRows.map(row => (
                <tr key={row} className="hover:bg-cell-hover">
                  <td className="form-cell p-0">
                    <Input 
                      className="form-input h-11" 
                      value={partsChanges[row]?.partName || ""}
                      onChange={(e) => updatePartsChange(row, "partName", e.target.value)}
                      placeholder="Enter part name..."
                    />
                  </td>
                  <td className="form-cell text-center">
                    <div className="touch-target">
                      <Checkbox 
                        className="form-checkbox"
                        checked={partsChanges[row]?.removeX || false}
                        onCheckedChange={(checked) => updatePartsChange(row, "removeX", !!checked)}
                      />
                    </div>
                  </td>
                  <td className="form-cell p-0">
                    <Input 
                      className="form-input h-11 text-center" 
                      value={partsChanges[row]?.removedBy || ""}
                      onChange={(e) => updatePartsChange(row, "removedBy", e.target.value)}
                    />
                  </td>
                  <td className="form-cell p-0">
                    <Input 
                      className="form-input h-11 text-center" 
                      value={partsChanges[row]?.installedBy || ""}
                      onChange={(e) => updatePartsChange(row, "installedBy", e.target.value)}
                    />
                  </td>
                  <td className="form-cell p-0">
                    <Input 
                      className="form-input h-11 text-center" 
                      value={partsChanges[row]?.inspectedBy || ""}
                      onChange={(e) => updatePartsChange(row, "inspectedBy", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Repair Routing */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="form-cell form-cell-header">REPAIR ROUTING</div>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            {routingBoxes.map((i) => (
              <div key={i} className="flex items-center">
                <Input 
                  className="w-16 h-14 text-center text-lg font-mono border-2 border-border rounded-md"
                  value={repairRouting[i] || ""}
                  onChange={(e) => setRepairRouting(p => ({...p, [i]: e.target.value}))}
                />
                {i < routingBoxes.length - 1 && (
                  <span className="mx-1 text-muted-foreground text-xl">&gt;</span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            *If all 15 routing boxes are full and/or the Parts On/Off boxes are full, please reprint Supplemental FIC and attach to the original FIC.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FICBackForm;
