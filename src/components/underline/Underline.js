import React from 'react';
import './Underline.css';

export default function Underline(props) {
  const { innerText, dark } = props;
  return (
    <strong className={dark ? 'dark' : ''}>{innerText}</strong>
  );
}

