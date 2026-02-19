export const safeJson = async res => {
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "API error");
  }
  return res.json();
};
