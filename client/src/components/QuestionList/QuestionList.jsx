import React from 'react';
import questionList from './questions.json';
import styles from './QuestionList.module.sass';

export default function QuestionList ({ children }) {
  const mapColums = (colum, i) => (
    <div key={i + 'colum'} className={styles.ColumnContainer}>
      {colum.map(mapQuestions)}
    </div>
  );

  const mapQuestions = (question, i) => {
    const uswear =
      i === 1 && questionList[i].length - 1 === i ? children : question.uswear;
    return (
      <div key={i + 'question'}>
        <div className={styles.headerArticle}>{question.questions}</div>
        <div className={styles.article}>{uswear}</div>
      </div>
    );
  };

  return (
    <div className={styles.articlesMainContainer}>
      {questionList.map(mapColums)}
    </div>
  );
}
