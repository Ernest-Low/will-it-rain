import { AreaMetadata, LabelLocation } from "../types/dataTypes";

const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRadians = (degree: number) => (degree * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const isWithinSingaporeBounds = (position: LabelLocation): boolean => {
  const singaporeBounds = {
    minLat: 1.2,
    maxLat: 1.48,
    minLon: 103.6,
    maxLon: 104.1,
  };

  return (
    position.latitude >= singaporeBounds.minLat &&
    position.latitude <= singaporeBounds.maxLat &&
    position.longitude >= singaporeBounds.minLon &&
    position.longitude <= singaporeBounds.maxLon
  );
};

const findClosestLocation = (
  currentPosition: LabelLocation,
  areaMetadata: AreaMetadata[]
): AreaMetadata | null => {
  if (!isWithinSingaporeBounds(currentPosition)) {
    console.log("Current position is outside the boundaries of Singapore.");
    return { name: "Not in Singapore", label_location: currentPosition };
  }

  let closestLocation: AreaMetadata | null = null;
  let minDistance = Infinity;

  areaMetadata.forEach((area) => {
    const distance = haversineDistance(
      currentPosition.latitude,
      currentPosition.longitude,
      area.label_location.latitude,
      area.label_location.longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestLocation = area;
    }
  });

  return closestLocation;
  // ? Sample return
  //   {
  //     name: "Ang Mo Kio",
  //     label_location: { latitude: 1.375, longitude: 103.839 }
  //   }
  //    or
  //   {
  //     name: "Not in Singapore",
  //     label_location: currentPosition
  //   }
};

export default findClosestLocation;
