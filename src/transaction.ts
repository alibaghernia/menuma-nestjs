import { Sequelize } from 'sequelize';

export const doInTransaction = async (
  seq: Sequelize,
  func: (transaction) => unknown,
) => {
  const transaction = await seq.transaction();
  try {
    const res = await func(transaction);
    await transaction.commit();
    return res;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
