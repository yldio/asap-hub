import React from 'react';
import { format } from 'date-fns';

interface DatetimeProps {
  readonly date: Date;
}

const Datetime: React.FC<DatetimeProps> = ({ date }) => {
  return <span>{format(date, 'do MMMM yyyy')}</span>;
};

export default Datetime;
