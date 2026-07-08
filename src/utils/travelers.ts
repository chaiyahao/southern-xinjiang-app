export interface Participant {
  id: string;
  fullName: string;
  nickname: string;
  color: string;
  pin: string;
}

export const PARTICIPANTS: Participant[] = [
  { id: "1", fullName: "CHAIYA WIBOONSANTISUK", nickname: "Hao", color: "#00008B", pin: "1111" },
  { id: "2", fullName: "NANUTDA PRAKHOD", nickname: "Benz", color: "#FF1493", pin: "2222" },
  { id: "3", fullName: "TIPUBON HOMCHAN", nickname: "Tare", color: "#006400", pin: "3333" },
  { id: "4", fullName: "NAPAS PATTARAAMORNPAN", nickname: "Cheer", color: "#FFA500", pin: "4444" },
  { id: "5", fullName: "NAKARED WATTANAMONTRI", nickname: "Tob", color: "#B8860B", pin: "5555" },
  { id: "6", fullName: "NATTARIKA KHAMMA", nickname: "Tarn", color: "#FF0000", pin: "6666" },
];

export function getParticipantById(id: string): Participant | undefined {
  return PARTICIPANTS.find(p => p.id === id);
}

export function formatDisplayName(idOrName: string, format: "full" | "nickname" | "combined" = "combined"): string {
  const query = idOrName.toLowerCase();
  const p = PARTICIPANTS.find(x => 
    x.id === idOrName || 
    x.fullName.toLowerCase().includes(query) || 
    x.nickname.toLowerCase().includes(query)
  );
  if (!p) return idOrName;
  if (format === "nickname") return p.nickname;
  if (format === "full") return p.fullName;
  return `${p.fullName} (${p.nickname})`;
}

export function getParticipantColor(idOrName: string): string {
  const query = idOrName.toLowerCase();
  const p = PARTICIPANTS.find(x => 
    x.id === idOrName || 
    x.fullName.toLowerCase().includes(query) || 
    x.nickname.toLowerCase().includes(query)
  );
  return p ? p.color : "#64748b"; // fallback slate
}
