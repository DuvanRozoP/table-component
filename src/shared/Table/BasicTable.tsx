import { FC } from 'react';
import styled from '../shared.module.css';

type action = {
  nameColumn: string;
  payload: () => void;
};

interface BasicTableProps {
  columns: string[];
  rows: string[][];
  actions: action[];
}
const BasicTable: FC<BasicTableProps> = ({ columns, rows, actions }) => {
  return (
    <table className={`${styled['basicTable']}`}>
      <thead>
        <tr>
          {columns.map((column: string, index: number) => (
            <th
              key={index}
              onClick={
                actions.find(action => action.nameColumn === column)?.payload
              }
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row: string[], rIndex: number) => (
          <tr key={rIndex}>
            {row.map((data: string, cIndex: number) => (
              <td key={cIndex}>{data}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BasicTable;
