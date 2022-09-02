export function replaceCommaAndSpaceWithEmptyString(str) {
  return str.replace(/,/g, "").replace(/ /g, "");
}

export function elaborateKMB(str) {
  const temp = replaceCommaAndSpaceWithEmptyString(str).toLowerCase();

  let value = "";

  if (temp.includes("k")) {
    value = parseInt(temp.replace(/k/g, "")) * 1000;
  } else if (temp.includes("m")) {
    value = parseInt(temp.replace(/m/g, "")) * 1000000;
  } else if (temp.includes("b")) {
    value = parseInt(temp.replace(/b/g, "")) * 1000000000;
  } else {
    value = parseInt(temp) || str;
  }
  console.log(value);

  return value;
}

export function extractChannelIDFromYoutubeURL(url) {
  return url ? url.split("/")[4] : url;
}
