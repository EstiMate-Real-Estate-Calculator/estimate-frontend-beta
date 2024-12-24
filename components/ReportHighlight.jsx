const ReportHighlight = ({ title, value }) => {
  return (
    <div className='flex w-fit flex-col items-center'>
      <p className='px-2 py-2 text-center text-lg font-semibold'>{title}</p>
      <p className='w-full rounded-md bg-light-primary px-3 py-2 text-center text-lg text-white'>
        {value}
      </p>
    </div>
  );
};

export default ReportHighlight;
