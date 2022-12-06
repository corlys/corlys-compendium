export const truncateAddress = (address: string) => {
  return `${address.substring(0, 4)}...${address.substring(38)}`;
};

export function stringToSlug(str: string) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaeeeeiiiioooouuuunc------";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
}

export function getBaseUrl() {
  switch (process.env.NODE_ENV) {
    case "development":
      return "http://localhost:3000";
    case "production":
      return "https://corlys-compendium.vercel.app";
    case "test":
      return "impossible";
    default:
      return "impossible";
  }
}
