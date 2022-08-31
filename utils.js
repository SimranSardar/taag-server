export function replaceCommaAndSpaceWithEmptyString(str) {
  return str.replace(/,/g, "").replace(/ /g, "");
}

export function elaborateKMB(str) {
  const temp = replaceCommaAndSpaceWithEmptyString(str.replace(/./g, ""));

  if (temp.includes("K")) {
    return parseInt(temp.replace("K", "")) * 1000;
  } else if (temp.includes("M")) {
    return parseInt(temp.replace("M", "")) * 1000000;
  } else if (temp.includes("B")) {
    return parseInt(temp.replace("B", "")) * 1000000000;
  } else {
    return parseInt(temp) || str;
  }
}

export function extractChannelIDFromYoutubeURL(url) {
  return url ? url.split("/")[4] : url;
}
