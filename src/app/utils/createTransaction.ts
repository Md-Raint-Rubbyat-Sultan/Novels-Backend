export const createTransactionId = () =>
  `trans_${Date.now()}_${Math.floor(Math.random() * 1000)}}`;
