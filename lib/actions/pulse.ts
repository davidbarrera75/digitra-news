"use server";

import { prisma } from "@/lib/db";
import { PulseData } from "@/lib/pulse/types";

function toPulseData(snapshot: {
  id: number;
  destinationId: number;
  date: Date;
  score: number;
  scoreLabel: string | null;
  flightsData: unknown;
  accommodationData: unknown;
  weatherData: unknown;
  eventsData: unknown;
  seasonType: string | null;
  aiSummary: string | null;
  destination: {
    id: number;
    name: string;
    slug: string;
    country: string;
    latitude: unknown;
    longitude: unknown;
  };
}): PulseData {
  return {
    id: snapshot.id,
    destinationId: snapshot.destinationId,
    destination: {
      id: snapshot.destination.id,
      name: snapshot.destination.name,
      slug: snapshot.destination.slug,
      country: snapshot.destination.country,
      latitude: snapshot.destination.latitude ? Number(snapshot.destination.latitude) : null,
      longitude: snapshot.destination.longitude ? Number(snapshot.destination.longitude) : null,
    },
    date: snapshot.date.toISOString().split("T")[0],
    score: snapshot.score,
    scoreLabel: snapshot.scoreLabel,
    flights: snapshot.flightsData as PulseData["flights"],
    accommodation: snapshot.accommodationData as PulseData["accommodation"],
    weather: snapshot.weatherData as PulseData["weather"],
    events: snapshot.eventsData as PulseData["events"],
    seasonType: snapshot.seasonType,
    aiSummary: snapshot.aiSummary,
  };
}

export async function getTodayPulses(): Promise<PulseData[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const snapshots = await prisma.pulseSnapshot.findMany({
    where: { date: today },
    include: { destination: true },
    orderBy: { score: "desc" },
  });

  return snapshots.map(toPulseData);
}

export async function getLatestPulses(): Promise<PulseData[]> {
  // Get the most recent snapshot for each destination
  const destinations = await prisma.destination.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const pulses: PulseData[] = [];
  for (const dest of destinations) {
    const snapshot = await prisma.pulseSnapshot.findFirst({
      where: { destinationId: dest.id },
      include: { destination: true },
      orderBy: { date: "desc" },
    });
    if (snapshot) pulses.push(toPulseData(snapshot));
  }

  return pulses.sort((a, b) => b.score - a.score);
}

export async function getCityPulse(citySlug: string): Promise<PulseData | null> {
  const dest = await prisma.destination.findUnique({ where: { slug: citySlug } });
  if (!dest) return null;

  const snapshot = await prisma.pulseSnapshot.findFirst({
    where: { destinationId: dest.id },
    include: { destination: true },
    orderBy: { date: "desc" },
  });

  if (!snapshot) return null;
  return toPulseData(snapshot);
}

export async function getCityPulseHistory(citySlug: string, days = 7): Promise<PulseData[]> {
  const dest = await prisma.destination.findUnique({ where: { slug: citySlug } });
  if (!dest) return [];

  const snapshots = await prisma.pulseSnapshot.findMany({
    where: { destinationId: dest.id },
    include: { destination: true },
    orderBy: { date: "desc" },
    take: days,
  });

  return snapshots.map(toPulseData);
}
