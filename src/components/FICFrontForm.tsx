import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InspectionRow {
  item: string;
  wiuAssoc: string;
  rej: boolean;
  repairedBy: string;
  inspectedBy: string;
}

interface TrunkTailgateApiData {
  vin?: string;
  tailgateFunction?: Partial<InspectionRow>;
  seatbeltFunction?: Partial<InspectionRow>;
  seatHeadrest?: Partial<InspectionRow>;
  vinLabelPrintedCondition?: Partial<InspectionRow>;
}

const FICFrontForm = () => {
  const { toast } = useToast();
  const [headerData, setHeaderData] = useState({
    model: "MDX 3.5L (2WD)",
    paintShift: "",
    assemblyDate: "",
    keyTagNumber: "",
    engineNumber: "",
    inspectedDate: "",
    vin: "5J8YD9H43TL000680",
    techInfo: "26M 5DR TECH AB5 KA",
    manualEntry: "TTYCAB5NH893PV D",
    productLot: "ELP 03AF202507230090",
    kdLot: "ELP 032025070017O3",
  });

  // Function items that can be updated via API (TRUNK/TAILGATE section)
  const trunkTailgateItems = [
    "VIN Label Printed Condition",
    "Tailgate Function",
    "Seatbelt Function",
    "Seat Headrest",
  ];

  // Map API field names to form item names
  const apiToFormMapping: Record<string, string> = {
    vinLabelPrintedCondition: "VIN Label Printed Condition",
    tailgateFunction: "Tailgate Function",
    seatbeltFunction: "Seatbelt Function",
    seatHeadrest: "Seat Headrest",
  };

  // Apply data received from API to the form
  const applyApiData = (data: TrunkTailgateApiData) => {
    setInspectionData(prev => {
      const updated = { ...prev };
      
      Object.entries(apiToFormMapping).forEach(([apiKey, formKey]) => {
        const apiData = data[apiKey as keyof TrunkTailgateApiData];
        if (apiData && typeof apiData === 'object') {
          updated[formKey] = {
            ...updated[formKey],
            wiuAssoc: (apiData as Partial<InspectionRow>).wiuAssoc || updated[formKey].wiuAssoc,
            rej: (apiData as Partial<InspectionRow>).rej ?? updated[formKey].rej,
            repairedBy: (apiData as Partial<InspectionRow>).repairedBy || updated[formKey].repairedBy,
            inspectedBy: (apiData as Partial<InspectionRow>).inspectedBy || updated[formKey].inspectedBy,
          };
        }
      });
      
      return updated;
    });
    
    // Update VIN if provided
    if (data.vin) {
      setHeaderData(prev => ({ ...prev, vin: data.vin! }));
    }
    
    toast({
      title: "API Data Applied",
      description: "TRUNK/TAILGATE section updated from API",
    });
  };

  // Expose the applyApiData function globally for testing
  useEffect(() => {
    (window as unknown as { applyTrunkTailgateData: typeof applyApiData }).applyTrunkTailgateData = applyApiData;
    return () => {
      delete (window as unknown as { applyTrunkTailgateData?: typeof applyApiData }).applyTrunkTailgateData;
    };
  }, []);

  const [stationChecks, setStationChecks] = useState({
    vqdOn: false, chassis: false, dyno: false, 
    ncat1: false, ncat2: false, 
    mdt1: false, mdt2: false,
    mas1: false, mas2: false, 
    function: false, preShip: false,
    shuttle60a: false, scan60a: false,
  });

  const [trackInspection, setTrackInspection] = useState({
    rough: false, short: false, long: false,
  });

  const [dtcStored, setDtcStored] = useState({
    wiuAssoc: "", rej: false, repairedBy: "", inspectedBy: "",
  });

  // Inspection items for left column
  const leftInspectionItems = [
    "Door Check Function",
    "Child Safety Lock Function",
    "Starter Interlock",
    "Door Glass Function",
    "Steering Wheel Installed Condition",
    "Steering Link Installed Condition",
    "Radio Function",
    "Door Mirror Condition",
  ];

  const chassisVisualItems = [
    "Coolant System Leaks",
    "Abnormal Engine Noise",
    "Brake Fluid Leaks",
    "Transmission Fluid Leaks",
    "Exhaust Installed Condition",
    "Exhaust Leak",
    "Fuel Tank Installed Condition",
    "Fuel Leak",
    "Rear Damper Installed Condition",
  ];

  const ncatItems = [
    "Driver Door Lock Function",
    "Meter Panel Lights Function",
    "Steering Wheel Tilt / Telescope",
    "Steering Link Installed Condition",
    "Front/Rear Toe",
    "Hood Lock Half Lock Installed Condition",
    "Fog Light Aim",
    "Headlight Aim",
    "Battery Installed Condition",
    "Fluid Leak",
    "Hood Information Label",
  ];

  const mdtItems = [
    "Speedo Error",
    "Speed Alarm Function",
    "Brake Force",
    "Parking Brake Force / Function",
    "Parking Pawl Function",
    "Shift Lever Interlock Function",
  ];

  const masItems = [
    "Front and Rear Windshield Wiper Function",
    "Driver Seat Slide Lock / Recliner Lock Function",
    "Rear View Mirror Installed Condition / Function",
    "Meter Panel Illumination Function",
    "Auto Headlight Leveling",
    "Driver's Seatbelt Function",
  ];

  const outsideDriveItems = [
    "Headlight Aim",
    "Headlight Washer Function",
    "Front / Rear Windshield Washer Function",
    "Door Mirrors Function",
    "Steering Gear Box Installed Condition",
    "Turn Signal Auto Return Function",
    "Door Auto-Lock Function",
    "Transmission Function",
    "Engine / Exhaust Abnormal Noise",
    "Steering Link Installed Condition",
    "Horn Tone and Function",
    "Cruise Control Function",
    "Front and Rear Defroster Function",
    "Brake Light Function",
    "Hazard Light Function",
    "Rear Fog Light Function",
    "License Light Function",
    "Turn Light (Front and Rear) Function",
    "Daytime Running Light Function",
    "Headlight Passing Function",
    "Reverse Lights Function",
    "Rear-Vision Camera Function",
    "Master Power Door Lock Function",
  ];

  const waterLeakItems = [
    "VIN Frame Stamping Condition (on models with carpet flap access)",
  ];

  const functionItems = [
    "VIN Label Printed Condition",
    "Tailgate Function",
    "Seatbelt Function",
    "Seat Headrest",
  ];

  const preShipItems = ["Tire Label"];

  const [inspectionData, setInspectionData] = useState<Record<string, InspectionRow>>(() => {
    const allItems = [
      ...leftInspectionItems, ...chassisVisualItems, ...ncatItems,
      ...mdtItems, ...masItems, ...outsideDriveItems, ...waterLeakItems,
      ...functionItems, ...preShipItems
    ];
    const initial: Record<string, InspectionRow> = {};
    allItems.forEach(item => {
      initial[item] = { item, wiuAssoc: "", rej: false, repairedBy: "", inspectedBy: "" };
    });
    return initial;
  });

  const updateInspection = (item: string, field: keyof InspectionRow, value: string | boolean) => {
    setInspectionData(prev => ({
      ...prev,
      [item]: { ...prev[item], [field]: value }
    }));
  };

  const InspectionRowComponent = ({ item, section }: { item: string; section?: string }) => (
    <tr className="border-b border-border hover:bg-cell-hover transition-colors">
      <td className="form-cell text-xs leading-tight py-2 px-2">
        {section && <span className="font-semibold text-primary">{section}: </span>}
        {item}
      </td>
      <td className="form-cell w-20">
        <Input
          className="form-input h-10"
          value={inspectionData[item]?.wiuAssoc || ""}
          onChange={(e) => updateInspection(item, "wiuAssoc", e.target.value)}
        />
      </td>
      <td className="form-cell w-14 text-center">
        <div className="touch-target">
          <Checkbox
            className="form-checkbox"
            checked={inspectionData[item]?.rej || false}
            onCheckedChange={(checked) => updateInspection(item, "rej", !!checked)}
          />
        </div>
      </td>
      <td className="form-cell w-24">
        <Input
          className="form-input h-10"
          value={inspectionData[item]?.repairedBy || ""}
          onChange={(e) => updateInspection(item, "repairedBy", e.target.value)}
        />
      </td>
      <td className="form-cell w-24">
        <Input
          className="form-input h-10"
          value={inspectionData[item]?.inspectedBy || ""}
          onChange={(e) => updateInspection(item, "inspectedBy", e.target.value)}
        />
      </td>
    </tr>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <tr>
      <td colSpan={5} className="form-cell form-cell-section py-2 font-semibold">
        {title}
      </td>
    </tr>
  );

  return (
    <div className="p-4 max-w-full overflow-x-auto animate-fade-in">
      {/* Header Section */}
      <div className="bg-card rounded-lg border border-border shadow-sm mb-4 overflow-hidden">
        <div className="bg-form-header text-form-header-foreground px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold tracking-wide">FINAL INSPECTION CARD</h1>
          <span className="font-mono text-sm">Page 1 of 2</span>
        </div>
        
        {/* Top info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0 border-b border-border">
          <div className="form-cell">
            <label className="text-xs text-muted-foreground block mb-1">Model</label>
            <Input className="form-input h-10" value={headerData.model} onChange={(e) => setHeaderData(p => ({...p, model: e.target.value}))} />
          </div>
          <div className="form-cell">
            <label className="text-xs text-muted-foreground block mb-1">Paint Shift</label>
            <div className="flex gap-2 items-center">
              <span className="text-sm">A</span>
              <Checkbox className="form-checkbox" />
              <span className="text-sm">B</span>
              <Checkbox className="form-checkbox" />
            </div>
          </div>
          <div className="form-cell">
            <label className="text-xs text-muted-foreground block mb-1">Assembly Date</label>
            <div className="flex gap-2 items-center">
              <span className="text-sm">A</span>
              <Checkbox className="form-checkbox" />
              <span className="text-sm">B</span>
              <Checkbox className="form-checkbox" />
            </div>
          </div>
          <div className="form-cell">
            <label className="text-xs text-muted-foreground block mb-1">Key Tag Number</label>
            <Input className="form-input h-10" value={headerData.keyTagNumber} onChange={(e) => setHeaderData(p => ({...p, keyTagNumber: e.target.value}))} />
          </div>
          <div className="form-cell">
            <label className="text-xs text-muted-foreground block mb-1">Engine Number</label>
            <Input className="form-input h-10" value={headerData.engineNumber} onChange={(e) => setHeaderData(p => ({...p, engineNumber: e.target.value}))} />
          </div>
          <div className="form-cell">
            <label className="text-xs text-muted-foreground block mb-1">Inspected Date</label>
            <div className="flex gap-2 items-center">
              <span className="text-sm">A</span>
              <Checkbox className="form-checkbox" />
              <span className="text-sm">B</span>
              <Checkbox className="form-checkbox" />
            </div>
          </div>
        </div>

        {/* VIN and Tech Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-border">
          <div className="form-cell bg-muted">
            <label className="text-xs text-muted-foreground block mb-1">VIN</label>
            <Input className="form-input h-10 font-bold text-lg" value={headerData.vin} onChange={(e) => setHeaderData(p => ({...p, vin: e.target.value}))} />
          </div>
          <div className="form-cell">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-muted-foreground">Tech Info</label>
                <div className="font-mono font-semibold">{headerData.techInfo}</div>
              </div>
              <div>
                <label className="text-muted-foreground">Manual Entry</label>
                <Input className="form-input h-8 text-xs" value={headerData.manualEntry} onChange={(e) => setHeaderData(p => ({...p, manualEntry: e.target.value}))} />
              </div>
            </div>
          </div>
        </div>

        {/* Station Checkboxes */}
        <div className="p-3 border-b border-border">
          <div className="flex flex-wrap gap-3 items-center">
            <label className="flex items-center gap-2 cursor-pointer touch-target">
              <Checkbox className="form-checkbox" checked={stationChecks.vqdOn} onCheckedChange={(checked) => setStationChecks(p => ({...p, vqdOn: !!checked}))} />
              <span className="text-xs font-medium uppercase">VQD ON</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer touch-target">
              <Checkbox className="form-checkbox" checked={stationChecks.chassis} onCheckedChange={(checked) => setStationChecks(p => ({...p, chassis: !!checked}))} />
              <span className="text-xs font-medium uppercase">CHASSIS</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer touch-target">
              <Checkbox className="form-checkbox" checked={stationChecks.dyno} onCheckedChange={(checked) => setStationChecks(p => ({...p, dyno: !!checked}))} />
              <span className="text-xs font-medium uppercase">DYNO</span>
            </label>
            
            {/* NCAT with 1 and 2 */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium uppercase">NCAT</span>
              <label className="flex items-center gap-1 cursor-pointer touch-target">
                <Checkbox className="form-checkbox" checked={stationChecks.ncat1} onCheckedChange={(checked) => setStationChecks(p => ({...p, ncat1: !!checked}))} />
                <span className="text-xs">1</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer touch-target">
                <Checkbox className="form-checkbox" checked={stationChecks.ncat2} onCheckedChange={(checked) => setStationChecks(p => ({...p, ncat2: !!checked}))} />
                <span className="text-xs">2</span>
              </label>
            </div>

            {/* MDT with 1 and 2 */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium uppercase">MDT</span>
              <label className="flex items-center gap-1 cursor-pointer touch-target">
                <Checkbox className="form-checkbox" checked={stationChecks.mdt1} onCheckedChange={(checked) => setStationChecks(p => ({...p, mdt1: !!checked}))} />
                <span className="text-xs">1</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer touch-target">
                <Checkbox className="form-checkbox" checked={stationChecks.mdt2} onCheckedChange={(checked) => setStationChecks(p => ({...p, mdt2: !!checked}))} />
                <span className="text-xs">2</span>
              </label>
            </div>

            {/* MAS with 1 and 2 */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium uppercase">MAS</span>
              <label className="flex items-center gap-1 cursor-pointer touch-target">
                <Checkbox className="form-checkbox" checked={stationChecks.mas1} onCheckedChange={(checked) => setStationChecks(p => ({...p, mas1: !!checked}))} />
                <span className="text-xs">1</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer touch-target">
                <Checkbox className="form-checkbox" checked={stationChecks.mas2} onCheckedChange={(checked) => setStationChecks(p => ({...p, mas2: !!checked}))} />
                <span className="text-xs">2</span>
              </label>
            </div>

            {/* Track with Rough, Short, Long */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase">TRACK</span>
              {Object.entries(trackInspection).map(([key, value]) => (
                <label key={key} className="flex items-center gap-1 cursor-pointer touch-target">
                  <Checkbox 
                    className="form-checkbox"
                    checked={value}
                    onCheckedChange={(checked) => setTrackInspection(p => ({...p, [key]: !!checked}))}
                  />
                  <span className="text-xs uppercase">{key}</span>
                </label>
              ))}
            </div>

            <label className="flex items-center gap-2 cursor-pointer touch-target">
              <Checkbox className="form-checkbox" checked={stationChecks.function} onCheckedChange={(checked) => setStationChecks(p => ({...p, function: !!checked}))} />
              <span className="text-xs font-medium uppercase">FUNCTION</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer touch-target">
              <Checkbox className="form-checkbox" checked={stationChecks.preShip} onCheckedChange={(checked) => setStationChecks(p => ({...p, preShip: !!checked}))} />
              <span className="text-xs font-medium uppercase">PRE-SHIP</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer touch-target">
              <Checkbox className="form-checkbox" checked={stationChecks.shuttle60a} onCheckedChange={(checked) => setStationChecks(p => ({...p, shuttle60a: !!checked}))} />
              <span className="text-xs font-medium uppercase">60A SHUTTLE</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer touch-target">
              <Checkbox className="form-checkbox" checked={stationChecks.scan60a} onCheckedChange={(checked) => setStationChecks(p => ({...p, scan60a: !!checked}))} />
              <span className="text-xs font-medium uppercase">60A SCAN</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Inspection Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="form-cell form-cell-header">Paint/AF/VQD's Write-up Space</div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="form-cell form-cell-header text-left">ITEM</th>
                  <th className="form-cell form-cell-header text-center w-20">WIU ASSOC#</th>
                  <th className="form-cell form-cell-header text-center w-14">REJ X</th>
                  <th className="form-cell form-cell-header text-center w-24">REPAIRED BY</th>
                  <th className="form-cell form-cell-header text-center w-24">INSPECTED BY</th>
                </tr>
              </thead>
              <tbody>
                {leftInspectionItems.map(item => (
                  <InspectionRowComponent key={item} item={item} />
                ))}
                <SectionHeader title="CHASSIS VISUAL" />
                {chassisVisualItems.map(item => (
                  <InspectionRowComponent key={item} item={item} />
                ))}
                <SectionHeader title="NCAT" />
                {ncatItems.map(item => (
                  <InspectionRowComponent key={item} item={item} />
                ))}
                <SectionHeader title="MDT" />
                {mdtItems.map(item => (
                  <InspectionRowComponent key={item} item={item} />
                ))}
                <SectionHeader title="MAS" />
                {masItems.map(item => (
                  <InspectionRowComponent key={item} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="form-cell form-cell-header">VQD Write-Up Space</div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="form-cell form-cell-header text-left">ITEM</th>
                  <th className="form-cell form-cell-header text-center w-20">WIU ASSOC#</th>
                  <th className="form-cell form-cell-header text-center w-14">REJ X</th>
                  <th className="form-cell form-cell-header text-center w-24">REPAIRED BY</th>
                  <th className="form-cell form-cell-header text-center w-24">INSPECTED BY</th>
                </tr>
              </thead>
              <tbody>
                <SectionHeader title="OUTSIDE DRIVE" />
                {outsideDriveItems.map(item => (
                  <InspectionRowComponent key={item} item={item} />
                ))}
                <SectionHeader title="WATER LEAK" />
                {waterLeakItems.map(item => (
                  <InspectionRowComponent key={item} item={item} />
                ))}
                <SectionHeader title="FUNCTION" />
                {functionItems.map(item => (
                  <InspectionRowComponent key={item} item={item} />
                ))}
                <SectionHeader title="PRE-SHIP" />
                {preShipItems.map(item => (
                  <InspectionRowComponent key={item} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DTC Stored Row - Moved to bottom */}
      <div className="bg-card rounded-lg border border-border shadow-sm mt-4 overflow-hidden">
        <div className="form-cell form-cell-header py-2">
          Check Engine Light On / Permanent DTC Stored
        </div>
        <div className="grid grid-cols-4 gap-0">
          <div className="form-cell">
            <label className="text-xs text-muted-foreground">WIU ASSOC</label>
            <Input className="form-input h-10" value={dtcStored.wiuAssoc} onChange={(e) => setDtcStored(p => ({...p, wiuAssoc: e.target.value}))} />
          </div>
          <div className="form-cell text-center">
            <label className="text-xs text-muted-foreground">REJ X</label>
            <div className="touch-target">
              <Checkbox className="form-checkbox" checked={dtcStored.rej} onCheckedChange={(checked) => setDtcStored(p => ({...p, rej: !!checked}))} />
            </div>
          </div>
          <div className="form-cell">
            <label className="text-xs text-muted-foreground">REPAIRED BY</label>
            <Input className="form-input h-10" value={dtcStored.repairedBy} onChange={(e) => setDtcStored(p => ({...p, repairedBy: e.target.value}))} />
          </div>
          <div className="form-cell">
            <label className="text-xs text-muted-foreground">INSPECTED BY</label>
            <Input className="form-input h-10" value={dtcStored.inspectedBy} onChange={(e) => setDtcStored(p => ({...p, inspectedBy: e.target.value}))} />
          </div>
        </div>
      </div>

      {/* CCC Label Box */}
      <div className="mt-4 bg-card rounded-lg border border-border shadow-sm p-4">
        <label className="text-xs text-muted-foreground block mb-2">CCC LABEL</label>
        <textarea 
          className="w-full h-24 border border-border rounded-md p-3 text-sm font-mono resize-none focus:ring-2 focus:ring-ring focus:outline-none bg-background"
          placeholder="Enter CCC Label information..."
        />
      </div>
    </div>
  );
};

export default FICFrontForm;
