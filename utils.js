export function replaceCommaAndSpaceWithEmptyString(str) {
  return str.replace(/,/g, "").replace(/ /g, "");
}

export function elaborateKMB(str) {
  const temp = replaceCommaAndSpaceWithEmptyString(
    str.replace(/./g, "")
  ).toLowerCase();

  if (temp.includes("k")) {
    return parseInt(temp.replace("k", "")) * 1000;
  } else if (temp.includes("m")) {
    return parseInt(temp.replace("m", "")) * 1000000;
  } else if (temp.includes("b")) {
    return parseInt(temp.replace("b", "")) * 1000000000;
  } else {
    return parseInt(temp) || str;
  }
}

export function extractChannelIDFromYoutubeURL(url) {
  return url ? url.split("/")[4] : url;
}
