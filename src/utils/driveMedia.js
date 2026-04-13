export function extractDriveFileId(urlRaw) {
  const url = String(urlRaw ?? "").trim();
  if (!url) return "";

  // Common Drive forms:
  // - .../file/d/<id>/view
  // - .../file/u/4/d/<id>/view
  // - ...open?id=<id>
  // - ...uc?export=view&id=<id>
  const fromPath = url.match(/\/file\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/);
  if (fromPath?.[1]) return fromPath[1];

  const fromQuery = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (fromQuery?.[1]) return fromQuery[1];

  return "";
}

export function driveThumbnailCandidates(urlRaw, size = "w600") {
  const id = extractDriveFileId(urlRaw);
  if (!id) return [];
  return [
    `https://drive.google.com/thumbnail?id=${id}&sz=${size}`,
    `https://drive.google.com/uc?export=view&id=${id}`,
    `https://lh3.googleusercontent.com/d/${id}=${size}`,
  ];
}
