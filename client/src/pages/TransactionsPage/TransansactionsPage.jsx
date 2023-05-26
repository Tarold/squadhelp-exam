import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { getTransactions } from '../../store/slices/transactionsSlice';

function TransansactionsPage () {
  // ! In all app must be unified code style
  const { transactions, isFetching, error } = useSelector(
    ({ transactionsStore }) => transactionsStore
  );

  const dispatch = useDispatch();

  const { get } = bindActionCreators({ get: getTransactions }, dispatch);

  useEffect(() => {
    get();
  }, []);

  return (
    <div>
      <Header />
      <main>
        TransansactionsPage
        {error && <div>Error</div>}
        {isFetching && <div>Loading...</div>}
        {!isFetching && !error && (
          <table>
            <caption>Finance Operations</caption>
            <thead>
              <tr>
                <th key={1}>Amount</th>
                <th key={2}>Operation Type</th>
                <th key={3}>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>{t.amount}</td>
                  <td>{t.operationType}</td>
                  <td>{t.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default TransansactionsPage;
