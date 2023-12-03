const HOST_API = "http://106.15.139.63:8080";

function request(url: string, params: object = {}) {
  return fetch(HOST_API + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }).then((res) => res.json());
}

export function getBl(params: any) {
  return request("/wms/bl/list", params);
}

export function checkBl(itemIds: number[]) {
  return request("/wms/bl/check", { itemIds });
}

export function getInStock() {
  return request("/wms/stock/to/shelve/list");
}

export function shelve(params: any) {
  return request("/wms/bl/shelve", params);
}

export function getOutStock() {
  return request("/wms/order/unfinish/list");
}

export function getOutList(params: any) {
  return request("/wms/stock/to/out/list", params);
}

export function outOrder(params: any) {
  return request("/wms/order/out", params);
}

export function cancelBl(blId: number) {
  return request("/wms/bl/cancel/shelve", { blId });
}
