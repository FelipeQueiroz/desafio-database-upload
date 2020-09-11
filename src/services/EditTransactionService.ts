import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface Request {
  id: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class EditTransanctionService {
  public async execute({
    id,
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction does not exist');
    }

    let transactionCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!transactionCategory) {
      transactionCategory = await categoryRepository.save({
        title: category,
      });
    }

    const transactionChecked = {
      id,
      title,
      value,
      type,
      category: transactionCategory,
    };

    const transactionUpdated = await transactionsRepository.save(
      transactionChecked,
    );

    return transactionUpdated;
  }
}

export default EditTransanctionService;
