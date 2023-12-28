import { Op } from 'sequelize';

export function _toSequelizeFilter(obj: any) {
  for (const key in obj) {
    const value = obj[key];
    if (value === undefined) {
      delete obj[key];
    } else if (value.$like) {
      obj[key] = {
        [Op.like]: value.$like,
      };
    } else if (value.$gte && value.$lte) {
      obj[key] = {
        [Op.between]: [value.$gte, value.$lte],
      };
    } else if (value.$gte) {
      obj[key] = {
        [Op.gte]: value.$gte,
      };
    } else if (value.$lte) {
      obj[key] = {
        [Op.lte]: value.$lte,
      };
    } else if (typeof value === 'object') {
      _toSequelizeFilter(value);
    }
  }
}

export function toSequelizeFilter(filter: any) {
  const clonedFilter = structuredClone(filter);
  _toSequelizeFilter(clonedFilter);
  return clonedFilter;
}
