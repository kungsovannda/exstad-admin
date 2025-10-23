interface GenerateFilenameProps {
  type?: string;
  program?: string;
  title?: string;
  generation?: string;
}

const generateFilename = ({ type, program, title, generation }: GenerateFilenameProps) => {
  const date = new Date().toISOString().split("T")[0]; // e.g. 2025-10-23
  const shortId = crypto.randomUUID().split("-")[0]; // 8-char unique ID

  // Order: type → title → program → generation → date → id
  const parts = [
    type,
    title,
    program,
    generation ? `gen${generation}` : undefined,
    date,
    shortId,
  ].filter(Boolean);

  return parts
    .join("_")
    .toLowerCase()
    .replaceAll(" ", "_");
};

export default generateFilename;
