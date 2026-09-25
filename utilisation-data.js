// COB utilisation figures — aggregated counts only, taken from the monthly
// HEYDOC/MiCare COB reports. Never add member names, NRIC or per-visit rows here:
// this file is public.
//
// To add a month: copy the last block, update the numbers, keep months in date order.
// `report` is the downloadable PDF in /reports (the full monthly report).
// Reason keys map to labels in utilisation.js (REASON_LABELS).

window.COB_UTILISATION = {
  updated: '2026-09-25',
  months: [
    {
      id: '2026-06',
      report: 'reports/WeKongsi-COB-Report-2026-06.pdf',
      period: { en: '7 – 30 June 2026', ms: '7 – 30 Jun 2026' },
      partial: true, // COB went live on 7 June
      activeMembers: 5206,
      membersUsed: 319,
      visits: 364,
      telemedicine: 0,
      reasons: { cold: 156, sinus: 52, stomach: 47, gastritis: 21, chest: 17, sprain: 12, skin: 12, ear: 11, other: 36 },
      states: { Selangor: 114, Johor: 48, Melaka: 39, 'Negeri Sembilan': 30, 'Kuala Lumpur': 24, Perak: 23, Pahang: 18, Kelantan: 15, 'Pulau Pinang': 15, Terengganu: 11, Kedah: 10, Perlis: 9, Sabah: 4, Putrajaya: 3 },
      statesUnrecorded: 1
    },
    {
      id: '2026-07',
      report: 'reports/WeKongsi-COB-Report-2026-07.pdf',
      period: { en: '1 – 31 July 2026', ms: '1 – 31 Julai 2026' },
      activeMembers: 6357,
      membersUsed: 522,
      visits: 602,
      telemedicine: 5,
      reasons: { cold: 276, stomach: 72, sinus: 58, gastritis: 40, sprain: 38, skin: 25, chest: 22, ear: 17, other: 54 },
      states: { Selangor: 202, Johor: 94, Melaka: 60, 'Negeri Sembilan': 52, 'Kuala Lumpur': 45, Perak: 28, Terengganu: 25, 'Pulau Pinang': 24, Kedah: 18, Pahang: 15, Kelantan: 12, Sabah: 10, Perlis: 10, Putrajaya: 5, Labuan: 1, Sarawak: 1 }
    },
    {
      id: '2026-08',
      report: 'reports/WeKongsi-COB-Report-2026-08.pdf',
      period: { en: '1 – 31 August 2026', ms: '1 – 31 Ogos 2026' },
      activeMembers: 6096,
      membersUsed: 537,
      visits: 592,
      telemedicine: 4,
      reasons: { cold: 293, sinus: 79, stomach: 48, gastritis: 37, sprain: 25, chest: 22, skin: 19, flu: 16, other: 53 },
      states: { Selangor: 204, Johor: 76, Melaka: 62, 'Negeri Sembilan': 59, 'Kuala Lumpur': 33, Kelantan: 30, Perak: 29, Pahang: 23, Terengganu: 19, Kedah: 17, 'Pulau Pinang': 17, Sabah: 7, Perlis: 7, Sarawak: 5, Putrajaya: 4 }
    }
  ]
};
