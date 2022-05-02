import axios from 'axios';
import * as moment from 'moment';
import { fromTimestampToDate } from '../core/converter';
import { Wallet } from 'src/entities/wallet.entity';
import { fromWeiToETH } from '../core/converter';

export interface ETHBalance extends Wallet {
  account: string;
  balance: number;
  old: boolean;
}

interface Transaction {
  timeStamp: string;
}

interface Response {
  status: string;
  message: string;
}

interface ETHBalances extends Response {
  result: Omit<ETHBalance, 'old' | 'address'>[];
}

interface Transactions extends Response {
  result: Transaction[];
}

const olderThanAYear = (timestamp: string): boolean => {
  const given = moment(fromTimestampToDate(Number(timestamp)));
  const current = moment().startOf('day');
  const daysInAYear = 365;
  const daysDiff = moment.duration(current.diff(given)).asDays();
  return daysDiff > daysInAYear;
};

const classifyAndConvertBalanceWallet = async (
  ethBalance: Omit<ETHBalance, 'old' | 'address'>,
  oneTransaction: Transaction,
  walletsClassified: Partial<ETHBalance>[],
  wallets: Wallet[],
): Promise<void> => {
  const favorite = wallets.find(
    (wallet) => wallet.address === ethBalance.account,
  ).favorite;
  if (oneTransaction) {
    const ethBalanceUpdated = {
      ...ethBalance,
      balance: fromWeiToETH(ethBalance.balance),
      address: ethBalance.account,
      old: olderThanAYear(oneTransaction.timeStamp),
      favorite,
    };
    walletsClassified.push(ethBalanceUpdated);
  } else {
    walletsClassified.push({
      ...ethBalance,
      old: false,
      address: ethBalance.account,
      favorite,
    });
  }
};

const checkWalletTransaction = async (wallet: string): Promise<Transaction> => {
  const sortingOrder = 'asc';
  const offset = '1';
  const url = `${process.env.ETH_API_URL}?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&page=1&offset=${offset}&sort=${sortingOrder}&apikey=${process.env.ETH_API_KEY}`;
  const response = await axios
    .get<Transactions>(url)
    .then((res) => res.data.result);
  return response?.[0];
};

export const getClassifiedWallets = async (
  ethBalances: Omit<ETHBalance, 'old' | 'address'>[],
  wallets: Wallet[],
): Promise<ETHBalance[]> => {
  const walletsClassified: ETHBalance[] = [];
  for (const ethBalance of ethBalances) {
    const firstTransaction = await checkWalletTransaction(ethBalance.account);
    classifyAndConvertBalanceWallet(
      ethBalance,
      firstTransaction,
      walletsClassified,
      wallets,
    );
  }
  return walletsClassified;
};

export const getEtherBalances = async (
  wallets: Wallet[],
): Promise<ETHBalance[]> => {
  if (wallets.length > 20) {
    throw new Error('Only up to 20 wallets are allowed.');
  }
  if (!wallets.length) {
    return [];
  }
  const walletsString = wallets.map((wallet) => wallet.address).join(',');
  const url = `${process.env.ETH_API_URL}?module=account&action=balancemulti&address=${walletsString}&tag=latest&apikey=${process.env.ETH_API_KEY}`;
  const response = await axios
    .get<ETHBalances>(url)
    .then((res) => res.data.result);
  const ethBalances: ETHBalance[] = await getClassifiedWallets(
    response,
    wallets,
  );
  return ethBalances;
};
