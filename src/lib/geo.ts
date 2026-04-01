import wkx from "wkx";
import { Buffer } from "buffer";

export function getCoordinatesFromHex(hexString: unknown) {
  if (typeof hexString !== 'string' || !hexString) return null;

  try {
    // 1. Convert the hex string into a Buffer
    const buffer = Buffer.from(hexString, "hex");
    
    // 2. Parse the buffer into a PostGIS Geometry object
    const geometry = wkx.Geometry.parse(buffer) as unknown as { x?: number; y?: number };

    // 3. Extract X (Lng) and Y (Lat) if it's a Point geometry
    if (geometry && typeof geometry.x === "number" && typeof geometry.y === "number") {
      return {
        lat: geometry.y,
        lng: geometry.x,
      };
    }
    
    return null;
  } catch (error) {
    console.error("Failed to parse PostGIS hex string:", error);
    return null;
  }
}