import { Op } from 'sequelize';
import { PaginationDto } from 'src/misc/dto/filters.dto';

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

export const getPagination = (filters: PaginationDto) => {
  const offset = filters.page
    ? +filters.page * +filters.limit - +filters.limit
    : 0;
  const limit = filters.limit ? +filters.limit : undefined;
  return {
    offset,
    limit,
  };
};
