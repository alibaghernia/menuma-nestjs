export function toSequelizeOrder(obj: any) {
  const seqOrder = [];
  for (const key in obj) {
    const value = obj[key];
    seqOrder.push([key, value == -1 ? 'DESC' : 'ASC']);
  }
  return seqOrder;
}
