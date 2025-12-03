import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface InspectionRow {
  item: string;
  wiuAssoc: string;
  rej: boolean;
  repairedBy: string;
  inspectedBy: string;
}

const FICFrontForm = () => {
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

  const [stationChecks, setStationChecks] = useState({
    vqdOn: false, chassis: false, dyno: false, ncat: false, mdt: false,
    mas: false, track: false, function: false, preShip: false,
    shuttle60a: false, scan60a: false,
  });

  const [flexInspection, setFlexInspection] = useState({
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
          <div className="flex flex-wrap gap-3">
            {Object.entries(stationChecks).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 min-w-[100px] cursor-pointer touch-target">
                <Checkbox 
                  className="form-checkbox"
                  checked={value}
                  onCheckedChange={(checked) => setStationChecks(p => ({...p, [key]: !!checked}))}
                />
                <span className="text-xs font-medium uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Flex Inspection */}
        <div className="p-3 flex items-center gap-4">
          <span className="text-xs font-semibold uppercase">Flex Inspection:</span>
          {Object.entries(flexInspection).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer touch-target">
              <Checkbox 
                className="form-checkbox"
                checked={value}
                onCheckedChange={(checked) => setFlexInspection(p => ({...p, [key]: !!checked}))}
              />
              <span className="text-xs uppercase">{key}</span>
            </label>
          ))}
        </div>
      </div>

      {/* DTC Stored Row */}
      <div className="bg-card rounded-lg border border-border shadow-sm mb-4 overflow-hidden">
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
